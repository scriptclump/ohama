import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Router, Request, Response } from 'express';
import { TestCase } from '../models/TestCase';
import { auth, AuthenticatedRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = Router();

// @route   POST /api/record
// @desc    Spawn Playwright codegen window, wait for close, and save the generated spec code
// @access  Private
router.post('/', auth, async (req: Request, res: Response) => {
  const { url, name } = req.body;
  const authReq = req as AuthenticatedRequest;

  if (!url || !name) {
    return res.status(400).json({ message: 'URL and Name are required' });
  }

  try {
    const apisRoot = path.join(__dirname, '../../');
    const tmpDir = path.join(apisRoot, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const codegenId = new mongoose.Types.ObjectId().toString();
    const tempSpecPath = path.join(tmpDir, `codegen-${codegenId}.spec.ts`);

    // Spawn codegen process
    const child = spawn(
      'npx',
      ['playwright', 'codegen', '-o', `tmp/codegen-${codegenId}.spec.ts`, url],
      {
        cwd: apisRoot,
        shell: true,
        env: { ...process.env }
      }
    );

    child.on('close', async (code) => {
      try {
        if (!fs.existsSync(tempSpecPath)) {
          return res.status(400).json({
            message: 'No code was recorded. Ensure you performed some actions in the browser before closing it.'
          });
        }

        const specCode = fs.readFileSync(tempSpecPath, 'utf8');

        // Clean up the temp spec file
        fs.unlinkSync(tempSpecPath);

        // Create new test case in Mongo
        const testCase = new TestCase({
          owner: authReq.user!.id,
          name,
          description: `Codegen recorded test for ${url}`,
          specCode,
          targetUrl: url,
          source: 'codegen',
          defaultEmulation: {
            browser: 'chromium'
          }
        });

        await testCase.save();
        res.status(201).json(testCase);
      } catch (err: any) {
        console.error('Error during codegen cleanup/save:', err);
        res.status(500).json({ message: 'Error saving recorded test case', error: err.message });
      }
    });
  } catch (err: any) {
    console.error('Error launching codegen:', err);
    res.status(500).json({ message: 'Failed to start codegen', error: err.message });
  }
});

export default router;
