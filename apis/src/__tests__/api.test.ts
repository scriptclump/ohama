// 1. Mock modules at the absolute top of the file
jest.mock('@playwright/test', () => ({
  devices: {
    'iPhone 13': { viewport: { width: 390, height: 844 }, userAgent: 'iPhone' },
    'Desktop Chrome': { viewport: { width: 1280, height: 720 }, userAgent: 'Chrome' },
    'Pixel 5': { viewport: { width: 393, height: 851 }, userAgent: 'Pixel' }
  }
}));

jest.mock('../services/runner', () => ({
  runPlaywrightTest: jest.fn()
}));

jest.mock('child_process', () => {
  const original = jest.requireActual('child_process');
  return {
    ...original,
    spawn: jest.fn()
  };
});

// 2. Imports
import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { TestCase } from '../models/TestCase';
import { TestRun } from '../models/TestRun';
import { runPlaywrightTest } from '../services/runner';
import { spawn } from 'child_process';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

describe('TaaS Backend API Integration Tests', () => {
  let authToken: string;
  const mockUserId = '6697b0c39f8bc275b28d0001';
  const mockTestCaseId = '6697b0c39f8bc275b28d0002';
  const mockRunId = '6697b0c39f8bc275b28d0003';

  beforeAll(() => {
    authToken = jwt.sign(
      { id: mockUserId, email: 'alex@example.com', name: 'Alex Mercer' },
      process.env.JWT_SECRET || 'supersecretjwtkey12345',
      { expiresIn: '7d' }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('1. Auth Routes', () => {
    it('POST /api/auth/register - should register a new user successfully', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User.prototype, 'save').mockResolvedValue({
        id: mockUserId,
        name: 'Alex Mercer',
        email: 'alex@example.com',
        passwordHash: 'hashedpassword'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alex Mercer',
          email: 'alex@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'alex@example.com');
    });

    it('POST /api/auth/login - should authenticate user and return token', async () => {
      const bcrypt = require('bcryptjs');
      const mockUser = {
        id: mockUserId,
        name: 'Alex Mercer',
        email: 'alex@example.com',
        passwordHash: await bcrypt.hash('Password123!', 10),
        save: jest.fn()
      };
      
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alex@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'alex@example.com');
    });

    it('GET /api/auth/me - should get user details from token', async () => {
      const mockUser = {
        _id: mockUserId,
        name: 'Alex Mercer',
        email: 'alex@example.com'
      };
      
      jest.spyOn(User, 'findById').mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      } as any);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'alex@example.com');
    });
  });

  describe('2. Test Case CRUD Routes', () => {
    it('POST /api/tests - should create a new TestCase', async () => {
      const testCaseData = {
        name: 'Google Search Test',
        description: 'Verifies Google search results',
        specCode: 'import { test } from "@playwright/test";',
        targetUrl: 'https://google.com'
      };

      jest.spyOn(TestCase.prototype, 'save').mockResolvedValue({
        _id: mockTestCaseId,
        owner: mockUserId,
        ...testCaseData
      });

      const res = await request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testCaseData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Google Search Test');
      expect(res.body).toHaveProperty('_id');
    });

    it('GET /api/tests - should retrieve list of test cases', async () => {
      const mockTests = [
        { _id: mockTestCaseId, name: 'Test 1', owner: mockUserId },
        { _id: 'other-id', name: 'Test 2', owner: mockUserId }
      ];

      jest.spyOn(TestCase, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTests)
      } as any);

      const res = await request(app)
        .get('/api/tests')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(2);
    });

    it('GET /api/tests/:id - should retrieve a single test case', async () => {
      const mockTest = { _id: mockTestCaseId, name: 'Test 1', owner: mockUserId };
      jest.spyOn(TestCase, 'findOne').mockResolvedValue(mockTest);

      const res = await request(app)
        .get(`/api/tests/${mockTestCaseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test 1');
    });

    it('PUT /api/tests/:id - should update a test case', async () => {
      const mockTest = {
        _id: mockTestCaseId,
        name: 'Test 1',
        owner: mockUserId,
        save: jest.fn().mockResolvedValue({
          _id: mockTestCaseId,
          name: 'Updated Name',
          owner: mockUserId
        })
      };

      jest.spyOn(TestCase, 'findOne').mockResolvedValue(mockTest);

      const res = await request(app)
        .put(`/api/tests/${mockTestCaseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name');
    });

    it('DELETE /api/tests/:id - should delete a test case and cascadingly delete its runs', async () => {
      const mockTest = {
        _id: mockTestCaseId,
        name: 'Test 1',
        owner: mockUserId,
        deleteOne: jest.fn().mockResolvedValue({})
      };

      const mockRuns = [
        { _id: mockRunId, testCase: mockTestCaseId, deleteOne: jest.fn().mockResolvedValue({}) }
      ];

      jest.spyOn(TestCase, 'findOne').mockResolvedValue(mockTest);
      jest.spyOn(TestRun, 'find').mockResolvedValue(mockRuns);

      const res = await request(app)
        .delete(`/api/tests/${mockTestCaseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(mockTest.deleteOne).toHaveBeenCalled();
      expect(mockRuns[0].deleteOne).toHaveBeenCalled();
    });
  });

  describe('3. Execution & Results Routes', () => {
    it('POST /api/tests/:id/run - should trigger a synchronous test run', async () => {
      const mockTest = {
        _id: mockTestCaseId,
        owner: mockUserId,
        specCode: 'import { test } from "@playwright/test";',
        defaultEmulation: { browser: 'chromium' }
      };

      jest.spyOn(TestCase, 'findOne').mockResolvedValue(mockTest);
      
      // Dynamically define the mock resolution for runner service
      (runPlaywrightTest as jest.Mock).mockResolvedValue({
        status: 'passed',
        durationMs: 1500,
        stdout: 'Mocked Playwright execution output',
        stderr: '',
        errorMessage: undefined,
        report: { stats: { duration: 1500 } },
        artifacts: [{ type: 'screenshot', path: 'runs/mock-run-id/screenshot.png' }]
      });

      jest.spyOn(TestRun.prototype, 'save').mockResolvedValue({
        _id: mockRunId,
        testCase: mockTestCaseId,
        owner: mockUserId,
        status: 'passed',
        emulation: { browser: 'chromium', device: 'Desktop Chrome' },
        durationMs: 1500,
        artifacts: [{ type: 'screenshot', path: 'runs/mock-run-id/screenshot.png' }]
      });

      const res = await request(app)
        .post(`/api/tests/${mockTestCaseId}/run`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ browser: 'chromium', device: 'Desktop Chrome' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'passed');
      expect(res.body).toHaveProperty('durationMs');
    });

    it('GET /api/tests/:id/runs - should list run history for a test case', async () => {
      const mockRuns = [
        { _id: mockRunId, testCase: mockTestCaseId, status: 'passed' }
      ];

      jest.spyOn(TestRun, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockRuns)
      } as any);

      const res = await request(app)
        .get(`/api/tests/${mockTestCaseId}/runs`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('status', 'passed');
    });

    it('GET /api/runs/:runId - should fetch single run details', async () => {
      const mockRun = { _id: mockRunId, testCase: mockTestCaseId, status: 'passed', owner: mockUserId };
      jest.spyOn(TestRun, 'findOne').mockResolvedValue(mockRun);

      const res = await request(app)
        .get(`/api/runs/${mockRunId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'passed');
    });
  });

  describe('4. Devices & Interactive Recording', () => {
    it('GET /api/devices - should get list of supported devices', async () => {
      const res = await request(app)
        .get('/api/devices')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('browsers');
      expect(res.body).toHaveProperty('devices');
      expect(res.body.browsers).toContain('chromium');
    });

    it('POST /api/record - should trigger codegen and create a TestCase', async () => {
      // Dynamically define the mock implementation of spawn inside this test block
      (spawn as jest.Mock).mockImplementation((command, args, options) => {
        const mockChild = {
          on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'close') {
              const apisRoot = path.join(__dirname, '../../');
              const tmpDir = path.join(apisRoot, 'tmp');
              if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
              }
              
              const outIndex = args.indexOf('-o');
              if (outIndex !== -1 && args[outIndex + 1]) {
                const specPath = path.resolve(apisRoot, args[outIndex + 1]);
                fs.writeFileSync(specPath, 'import { test } from "@playwright/test";\n// Mock recorded actions', 'utf8');
              }
              
              setTimeout(() => callback(0), 100);
            }
            return mockChild;
          }),
          stdout: { on: jest.fn() },
          stderr: { on: jest.fn() },
          kill: jest.fn()
        };
        return mockChild;
      });

      jest.spyOn(TestCase.prototype, 'save').mockResolvedValue({
        _id: 'codegen-test-case-id',
        name: 'Recorded Test',
        source: 'codegen',
        specCode: 'import { test } from "@playwright/test";\n// Mock recorded actions'
      });

      const res = await request(app)
        .post('/api/record')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Recorded Test',
          url: 'https://example.com'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('source', 'codegen');
      expect(res.body).toHaveProperty('specCode');
    });
  });
});
