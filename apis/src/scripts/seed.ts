import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { TestCase } from '../models/TestCase';
import { TestRun } from '../models/TestRun';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playwright-taas';

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database.');

    // Clear existing data to prevent duplications
    console.log('Clearing old data from User, TestCase, and TestRun collections...');
    await User.deleteMany({});
    await TestCase.deleteMany({});
    await TestRun.deleteMany({});
    console.log('Collections cleared.');

    // Create the default test user
    console.log('Creating default test user (test@email.com)...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    const user = new User({
      name: 'Test User',
      email: 'test@email.com',
      passwordHash
    });
    await user.save();
    console.log('User test@email.com created successfully.');

    const userId = user._id;

    // Define scenarios/modules and their tags & 20 specific test names
    const scenarios = [
      {
        module: 'ERP',
        tags: ["Inventory Control", "Order Management", "Procurement", "User Portal"],
        testNames: [
          'Verify Inventory Stock Count Update',
          'Search for Product SKU',
          'Create Purchase Order Requisition',
          'Approve Supplier Contract',
          'Load User Profile Dashboard',
          'Update User Shipping Address',
          'Bulk Import Product CSV',
          'Export Sales Report to PDF',
          'Validate Tax Code Calculation',
          'Process Return Merchandise Authorization (RMA)',
          'Check Warehousing Bin Allocation',
          'Reconcile Monthly Inventory Valuation',
          'Test Employee Roles & Permissions',
          'Sync ERP Database with CRM',
          'Verify Multi-currency Order Conversion',
          'Check Automated Reorder Alerts',
          'Verify Supplier Ledger Balances',
          'Test OAuth2 Single Sign-On',
          'Audit Log Trail Verification',
          'Validate System Health Check Endpoint'
        ]
      },
      {
        module: 'Accounts Payable',
        tags: ["Invoice Processing", "Vendor Match", "Receipt Scanning", "Approval Workflow"],
        testNames: [
          'Verify Invoice Total Matching',
          'Detect PDF Scan Fields',
          'Post Vendor Credit Note',
          'Verify Vendor Bank Details Verification',
          'Process Duplicated Invoice Alert',
          'Approve Invoice Over Limit Request',
          'Match Receipt line items',
          'Test Vendor Portal Login',
          'Calculate Dynamic Discount Dates',
          'Reconcile Payment Outbox Batch',
          'Submit Expense Report for Review',
          'Flag High Risk Payment Transactions',
          'Check Vendor Master File Updates',
          'Calculate Accounts Payable Aging Report',
          'Validate Tax ID format checker',
          'Verify 1099 Tax Form Generator',
          'Approve Travel and Lodging Receipts',
          'Check OCR Recognition Accuracy Rate',
          'Test Vendor API Webhook Callback',
          'Verify Auto-Approval Threshold Rules'
        ]
      },
      {
        module: 'Accounts Receivable',
        tags: ["Billing", "Payment Processing", "Customer Match", "Ledger Sync"],
        testNames: [
          'Create Recurring Billing Invoice',
          'Process Credit Card Payment via Stripe',
          'Process ACH Direct Debit Payment',
          'Match Customer Payment Reference',
          'Sync Ledger with External Banking Feed',
          'Calculate AR Aging Balances',
          'Generate Customer Account Statement PDF',
          'Send Late Payment Automated Reminder',
          'Verify Customer Credit Limit Exceeded Warning',
          'Process Refund Request back to card',
          'Verify Invoice Line Item Discounts',
          'Apply Unallocated Cash to Invoice',
          'Verify Tax Exemption Certificate Upload',
          'Verify Stripe Webhook Charge Succeeded',
          'Create Installment Payment Plan',
          'Match Customer PO to Invoice Number',
          'Calculate Write-off Bad Debt entries',
          'Test Customer Self-Service Portal Login',
          'Verify Balance Sheet Accounts Receivable updates',
          'Audit AR Ledger entry journal posts'
        ]
      },
      {
        module: 'Fixed Assets',
        tags: ["Asset Tracking", "Depreciation Calculate", "Audit Trails", "Disposals"],
        testNames: [
          'Capitalize New Fixed Asset Entry',
          'Calculate Straight-Line Depreciation',
          'Calculate Double Declining Depreciation',
          'Verify Asset Physical Location Tag',
          'Record Asset Maintenance Schedule',
          'Process Asset Disposal Write-off',
          'Log Asset Transfer between departments',
          'Audit Log Asset History details',
          'Validate Asset Impairment Charge calculation',
          'Verify Revaluation Model adjustment',
          'Track Leased Asset Schedule payment',
          'Verify Insurance Coverage Policy Expiry alerts',
          'Generate Fixed Asset Register report',
          'Import Asset List from excel',
          'Verify Tax Depreciation vs Book Depreciation difference',
          'Check Depreciable Base limit boundaries',
          'Test Asset barcodes scanner input validation',
          'Record Salvage Value adjustment',
          'Reconcile GL Accum Depreciation accounts',
          'Audit Asset Custodian Sign-off status'
        ]
      }
    ];

    const browsers = ['chromium', 'firefox', 'webkit'];
    const devices = ['Desktop Chrome', 'iPhone 13', 'Pixel 5', undefined];
    
    // We want a high pass rate overall, matching standard configurations
    const statuses: Array<'passed' | 'failed' | 'timedout' | 'error'> = [
      'passed', 'passed', 'passed', 'passed', 'passed',
      'passed', 'failed', 'passed', 'passed', 'timedout', 
      'passed', 'passed', 'passed', 'error', 'passed'
    ];

    console.log('Generating 20 Test Cases and associated Test Runs for each module...');

    let totalCases = 0;
    let totalRuns = 0;

    for (const sc of scenarios) {
      console.log(`Generating data for scenario/module: ${sc.module}...`);
      for (let i = 0; i < 20; i++) {
        const name = sc.testNames[i];
        const description = `Autogenerated validation suite for checking ${name.toLowerCase()} within Omaha upstream.`;
        const tag = sc.tags[i % sc.tags.length];
        
        const specCode = `import { test, expect } from '@playwright/test';

test('${name.replace(/'/g, "\\'")}', async ({ page }) => {
  // Navigate to target module URL
  await page.goto('https://omaha.example.com/${sc.module.toLowerCase().replace(/ /g, '-')}/test-${i}');
  
  // Perform basic interactions
  const title = await page.title();
  expect(title).toBeDefined();
  
  // Verify main elements exist on page
  const header = page.locator('h1');
  await expect(header).toBeVisible();
  
  // Verify system status
  const statusEl = page.locator('#system-status');
  await expect(statusEl).toHaveText('Active');
});`;

        const testCase = new TestCase({
          owner: userId,
          name,
          description,
          specCode,
          targetUrl: `https://omaha.example.com/${sc.module.toLowerCase().replace(/ /g, '-')}/test-${i}`,
          defaultEmulation: {
            device: devices[i % devices.length],
            browser: browsers[i % browsers.length] as any
          },
          source: i % 3 === 0 ? 'codegen' : 'manual',
          module: sc.module,
          tags: [tag]
        });

        await testCase.save();
        totalCases++;

        // Create historical runs spread over the last 30 days
        // Having 6-12 runs per test case guarantees excellent dashboard visual aesthetics.
        const runsCount = Math.floor(Math.random() * 7) + 6; // 6 to 12 runs
        for (let r = 0; r < runsCount; r++) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const browser = browsers[Math.floor(Math.random() * browsers.length)];
          const device = devices[Math.floor(Math.random() * devices.length)];
          const durationMs = Math.floor(Math.random() * 2500) + 500; // 500ms to 3000ms

          // Distribute date over the last 30 days (concentrated mostly in recent days)
          const startedAt = new Date();
          const daysAgo = Math.floor(Math.random() * 30);
          const hoursAgo = Math.floor(Math.random() * 24);
          const minutesAgo = Math.floor(Math.random() * 60);
          startedAt.setDate(startedAt.getDate() - daysAgo);
          startedAt.setHours(startedAt.getHours() - hoursAgo);
          startedAt.setMinutes(startedAt.getMinutes() - minutesAgo);

          const finishedAt = new Date(startedAt.getTime() + durationMs);

          const testRun = new TestRun({
            testCase: testCase._id,
            owner: userId,
            status,
            emulation: {
              device,
              browser
            },
            durationMs,
            startedAt,
            finishedAt,
            stdout: `Running ${name} spec...\nNavigating to ${testCase.targetUrl}\nTest execution completed with status: ${status}`,
            stderr: status === 'failed' || status === 'error' ? `Error: Element not found or assertion failed.\nExpected: "Active"\nReceived: "Offline"` : '',
            errorMessage: status === 'failed' ? 'AssertionError: page.locator("#system-status") expected to have text "Active"' : status === 'error' ? 'UnknownError: Web socket connection aborted' : status === 'timedout' ? 'TimeoutError: Action timeout of 30000ms exceeded' : undefined,
            report: {
              stats: {
                duration: durationMs,
                suites: 1,
                tests: 1,
                passes: status === 'passed' ? 1 : 0,
                failures: status === 'failed' || status === 'error' || status === 'timedout' ? 1 : 0
              }
            },
            artifacts: status === 'failed' || status === 'error' ? [
              { type: 'screenshot', path: `runs/${testCase._id}/screenshot.png` },
              { type: 'trace', path: `runs/${testCase._id}/trace.zip` }
            ] : []
          });

          await testRun.save();
          totalRuns++;
        }
      }
    }

    console.log(`\nSeeding completed successfully!`);
    console.log(`Created: ${totalCases} Test Cases total (20 per scenario/module).`);
    console.log(`Created: ${totalRuns} historical Test Runs.`);
    
    await mongoose.connection.close();
    console.log('Mongoose connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed execution:', error);
    process.exit(1);
  }
};

run();
