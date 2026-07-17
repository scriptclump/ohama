import { Router, Request, Response } from 'express';
import { TestCase } from '../models/TestCase';
import { TestRun } from '../models/TestRun';
import { auth, AuthenticatedRequest } from '../middleware/auth';
import { runPlaywrightTest } from '../services/runner';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const router = Router();

// Helper to find file recursively in a directory
const findFileRecursively = (dir: string, fileName: string): string | null => {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const found = findFileRecursively(fullPath, fileName);
      if (found) return found;
    } else if (file.toLowerCase() === fileName.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
};

// @route   POST /api/tests/:id/run
// @desc    Execute a test case (synchronous)
// @access  Private
router.post('/tests/:id/run', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { device, browser } = req.body;
  const authReq = req as AuthenticatedRequest;

  try {
    const testCase = await TestCase.findOne({ _id: id, owner: authReq.user!.id });
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }

    // Determine configuration (override defaults if body parameters are provided)
    const runDevice = device !== undefined ? device : testCase.defaultEmulation?.device;
    const runBrowser = browser !== undefined ? browser : (testCase.defaultEmulation?.browser || 'chromium');

    // Create a new TestRun document ID beforehand
    const runId = new mongoose.Types.ObjectId().toString();
    const startedAt = new Date();

    // Run the Playwright test
    const runResult = await runPlaywrightTest(runId, testCase.specCode, runBrowser, runDevice);
    const finishedAt = new Date();

    // Create and save the TestRun document
    const testRun = new TestRun({
      _id: runId,
      testCase: testCase._id,
      owner: authReq.user!.id,
      status: runResult.status,
      emulation: {
        device: runDevice,
        browser: runBrowser
      },
      durationMs: runResult.durationMs,
      startedAt,
      finishedAt,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      errorMessage: runResult.errorMessage,
      report: runResult.report,
      artifacts: runResult.artifacts
    });

    await testRun.save();
    res.json(testRun);
  } catch (err: any) {
    console.error('Error running test:', err);
    res.status(500).json({ message: 'Server error during test execution', error: err.message });
  }
});

// @route   GET /api/tests/:id/runs
// @desc    Get execution history for a test case
// @access  Private
router.get('/tests/:id/runs', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const authReq = req as AuthenticatedRequest;

  try {
    const runs = await TestRun.find({ testCase: id, owner: authReq.user!.id }).sort({ createdAt: -1 });
    res.json(runs);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/runs/:runId
// @desc    Get details of a specific test run
// @access  Private
router.get('/runs/:runId', auth, async (req: Request, res: Response) => {
  const { runId } = req.params;
  const authReq = req as AuthenticatedRequest;

  try {
    const run = await TestRun.findOne({ _id: runId, owner: authReq.user!.id });
    if (!run) {
      return res.status(404).json({ message: 'Test run not found' });
    }
    res.json(run);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/runs/:runId/artifacts/:fileName
// @desc    Serve artifact file (screenshot, video, or trace)
// @access  Private
router.get('/runs/:runId/artifacts/:fileName', auth, async (req: Request, res: Response) => {
  const { runId, fileName } = req.params;
  const authReq = req as AuthenticatedRequest;

  try {
    // Verify run belongs to user
    const run = await TestRun.findOne({ _id: runId, owner: authReq.user!.id });
    if (!run) {
      return res.status(404).json({ message: 'Test run not found or unauthorized' });
    }

    const apisRoot = path.join(__dirname, '../../');
    const runDir = path.join(apisRoot, 'runs', runId);

    // Try direct filename resolve first
    let filePath = path.resolve(runDir, fileName);
    if (!filePath.startsWith(runDir)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      // Find recursively if it was deep inside report
      const found = findFileRecursively(runDir, fileName);
      if (found) {
        filePath = found;
      } else {
        return res.status(404).json({ message: 'Artifact file not found' });
      }
    }

    res.sendFile(filePath);
  } catch (err: any) {
    console.error('Error serving artifact:', err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/runs/:runId/artifacts-wildcard/*
// @desc    Serve artifact file with deep subpaths
// @access  Private
router.get('/runs/:runId/artifacts-wildcard/*', auth, async (req: Request, res: Response) => {
  const { runId } = req.params;
  const subPath = req.params[0];
  const authReq = req as AuthenticatedRequest;

  try {
    // Verify run belongs to user
    const run = await TestRun.findOne({ _id: runId, owner: authReq.user!.id });
    if (!run) {
      return res.status(404).json({ message: 'Test run not found or unauthorized' });
    }

    const apisRoot = path.join(__dirname, '../../');
    const runDir = path.join(apisRoot, 'runs', runId);
    const filePath = path.resolve(runDir, subPath);

    if (!filePath.startsWith(runDir)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return res.status(404).json({ message: 'Artifact file not found' });
    }

    res.sendFile(filePath);
  } catch (err: any) {
    console.error('Error serving wildcard artifact:', err);
    res.status(500).send('Server error');
  }
});

export default router;
