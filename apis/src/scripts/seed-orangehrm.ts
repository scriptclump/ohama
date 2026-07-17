import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { TestCase } from '../models/TestCase';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playwright-taas';

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database.');

    console.log('Retrieving test@email.com user account...');
    const user = await User.findOne({ email: 'test@email.com' });
    if (!user) {
      console.error('Test user "test@email.com" not found. Please seed the database first.');
      process.exit(1);
    }

    const userId = user._id;

    console.log('Adding OrangeHRM Login test case...');
    
    // Playwright spec code targeting OrangeHRM login page validations
    const specCode = `import { test, expect } from '@playwright/test';

test('Verify OrangeHRM Login Form Validations', async ({ page }) => {
  // Navigate to OrangeHRM login page
  console.log('Navigating to OrangeHRM Login Page...');
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  
  // Wait for layout rendering
  await page.waitForSelector('input[name="username"]', { timeout: 10000 });
  
  const usernameInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');
  
  // Verify inputs are visible
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(submitButton).toBeVisible();
  
  // Click submit with blank inputs to trigger empty field validations
  console.log('Clicking submit on empty inputs to verify validation warning...');
  await submitButton.click();
  
  // Validate "Required" input error label is visible
  const errorMsg = page.locator('.oxd-input-group__message');
  await expect(errorMsg.first()).toBeVisible();
  await expect(errorMsg.first()).toHaveText('Required');
  
  // Input invalid credentials to trigger alert
  console.log('Inputting invalid credentials...');
  await usernameInput.fill('invalid_user_admin');
  await passwordInput.fill('wrong_password_123');
  await submitButton.click();
  
  // Verify credentials mismatch alert box
  console.log('Verifying invalid credentials alert dialog presence...');
  const alertBox = page.locator('.oxd-alert-content');
  await expect(alertBox).toBeVisible();
  await expect(alertBox).toContainText('Invalid credentials');
  
  console.log('OrangeHRM Login test validated successfully.');
});`;

    const orangeHRMTestCase = new TestCase({
      owner: userId,
      name: 'OrangeHRM Login Page validations',
      description: 'Tests input fields visibility, blank inputs validation warning, and invalid credentials error alert for OrangeHRM.',
      specCode,
      targetUrl: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
      defaultEmulation: {
        browser: 'chromium'
      },
      source: 'manual',
      module: 'Auth',
      tags: ['OrangeHRM', 'auth-check', 'form-validations']
    });

    await orangeHRMTestCase.save();
    console.log(`OrangeHRM seed test case added successfully! ID: ${orangeHRMTestCase._id}`);

    await mongoose.connection.close();
    console.log('Mongoose connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during OrangeHRM test case seeding:', error);
    process.exit(1);
  }
};

run();
