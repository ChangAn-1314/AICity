import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Wait for the page to be fully loaded and hydrated
  await page.waitForLoadState('domcontentloaded');
  
  // Wait a bit for Vue hydration to complete
  // This ensures event handlers are attached to form elements
  await page.waitForTimeout(500);
  
  // Fill in login credentials
  // Using Element Plus input placeholders
  const usernameInput = page.locator('input[placeholder="用户名"]');
  const passwordInput = page.locator('input[placeholder="密码"]');
  
  await expect(usernameInput).toBeVisible({ timeout: 10000 });
  await usernameInput.fill('admin');
  await passwordInput.fill('admin');
  
  // Find and click the login button
  // The button text is "登 录" (with a space) or "登录中..." when loading
  const loginBtn = page.locator('button').filter({ hasText: /登\s*录/ });
  await expect(loginBtn).toBeVisible();
  await expect(loginBtn).toBeEnabled();
  
  // Click login
  await loginBtn.click();
  
  // Wait for navigation to dashboard
  // The auth guard should redirect to '/' after successful login
  await page.waitForURL('**/', { timeout: 15000 });
  
  // Verify we're on the dashboard by checking for a key element
  await expect(page).toHaveTitle(/AICity/i);
  
  // Wait for the page to stabilize
  await page.waitForLoadState('networkidle').catch(() => {});
  
  // Save the authentication state
  // This includes cookies, localStorage, and sessionStorage
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication setup completed, state saved to:', authFile);
});
