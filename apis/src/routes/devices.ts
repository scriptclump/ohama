import { Router, Request, Response } from 'express';
import { devices } from '@playwright/test';
import { auth } from '../middleware/auth';

const router = Router();

// @route   GET /api/devices
// @desc    Get list of emulation devices and browser engines
// @access  Private
router.get('/', auth, (req: Request, res: Response) => {
  try {
    const deviceNames = Object.keys(devices);
    const browsers = ['chromium', 'firefox', 'webkit'];
    res.json({
      browsers,
      devices: deviceNames
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve devices list', error: error.message });
  }
});

export default router;
