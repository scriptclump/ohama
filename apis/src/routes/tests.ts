import { Router, Request, Response } from 'express';
import { TestCase } from '../models/TestCase';
import { TestRun } from '../models/TestRun';
import { auth, AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

const router = Router();

// @route   POST /api/tests
// @desc    Create a test case
// @access  Private
router.post('/', auth, async (req: Request, res: Response) => {
  const { name, description, specCode, targetUrl, defaultEmulation, source, module, tags } = req.body;
  const authReq = req as AuthenticatedRequest;

  try {
    if (!name || !specCode) {
      return res.status(400).json({ message: 'Name and specCode are required' });
    }

    const testCase = new TestCase({
      owner: authReq.user!.id,
      name,
      description,
      specCode,
      targetUrl,
      defaultEmulation,
      source: source || 'manual',
      module,
      tags
    });

    await testCase.save();
    res.status(201).json(testCase);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tests
// @desc    Get all test cases of user
// @access  Private
router.get('/', auth, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const tests = await TestCase.find({ owner: authReq.user!.id }).sort({ updatedAt: -1 });
    res.json(tests);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tests/:id
// @desc    Get a specific test case by ID
// @access  Private
router.get('/:id', auth, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const test = await TestCase.findOne({ _id: req.params.id, owner: authReq.user!.id });
    if (!test) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    res.json(test);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tests/:id
// @desc    Update a test case
// @access  Private
router.put('/:id', auth, async (req: Request, res: Response) => {
  const { name, description, specCode, targetUrl, defaultEmulation, source, module, tags } = req.body;
  const authReq = req as AuthenticatedRequest;

  try {
    let test = await TestCase.findOne({ _id: req.params.id, owner: authReq.user!.id });
    if (!test) {
      return res.status(404).json({ message: 'Test case not found' });
    }

    if (name !== undefined) test.name = name;
    if (description !== undefined) test.description = description;
    if (specCode !== undefined) test.specCode = specCode;
    if (targetUrl !== undefined) test.targetUrl = targetUrl;
    if (defaultEmulation !== undefined) test.defaultEmulation = defaultEmulation;
    if (source !== undefined) test.source = source;
    if (module !== undefined) test.module = module;
    if (tags !== undefined) test.tags = tags;

    await test.save();
    res.json(test);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tests/:id
// @desc    Delete a test case and its runs + artifact folders
// @access  Private
router.delete('/:id', auth, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const test = await TestCase.findOne({ _id: req.params.id, owner: authReq.user!.id });
    if (!test) {
      return res.status(404).json({ message: 'Test case not found' });
    }

    // Find and delete all related runs and their directory artifacts
    const runs = await TestRun.find({ testCase: test._id });
    for (const run of runs) {
      const runDir = path.join(__dirname, '../../runs', run._id.toString());
      if (fs.existsSync(runDir)) {
        fs.rmSync(runDir, { recursive: true, force: true });
      }
      await run.deleteOne();
    }

    await test.deleteOne();
    res.json({ message: 'Test case and all associated runs and artifacts deleted successfully' });
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
