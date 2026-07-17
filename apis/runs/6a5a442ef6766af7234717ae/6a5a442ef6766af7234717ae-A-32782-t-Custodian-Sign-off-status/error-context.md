# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 6a5a442ef6766af7234717ae.spec.ts >> Audit Asset Custodian Sign-off status
- Location: tmp/6a5a442ef6766af7234717ae.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CERT_AUTHORITY_INVALID at https://omaha.example.com/fixed-assets/test-19
Call log:
  - navigating to "https://omaha.example.com/fixed-assets/test-19", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Audit Asset Custodian Sign-off status', async ({ page }) => {
  4  |   // Navigate to target module URL
> 5  |   await page.goto('https://omaha.example.com/fixed-assets/test-19');
     |              ^ Error: page.goto: net::ERR_CERT_AUTHORITY_INVALID at https://omaha.example.com/fixed-assets/test-19
  6  |   
  7  |   // Perform basic interactions
  8  |   const title = await page.title();
  9  |   expect(title).toBeDefined();
  10 |   
  11 |   // Verify main elements exist on page
  12 |   const header = page.locator('h1');
  13 |   await expect(header).toBeVisible();
  14 |   
  15 |   // Verify system status
  16 |   const statusEl = page.locator('#system-status');
  17 |   await expect(statusEl).toHaveText('Active');
  18 | });
```