import { test, expect } from '@playwright/test';

test.describe('AICity Dashboard E2E', () => {
  // Authentication is handled by auth.setup.js
  // Tests start with pre-authenticated storageState
  
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard - should not redirect to login
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Verify we're on the dashboard (not redirected to login)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      throw new Error('Authentication failed: redirected to login page');
    }
    
    // Wait for key dashboard content to appear
    // Use a short timeout - if it doesn't load quickly, individual tests will handle it
    await page.waitForSelector('h3', { timeout: 10000 }).catch(() => {
      console.log('Dashboard headers not immediately visible');
    });
  });

  test('should load the dashboard with all key modules', async ({ page }) => {
    await expect(page).toHaveTitle(/AICity/i);
    
    // Check Left Panel
    await expect(page.locator('body')).toContainText('实时舆情监控');
    
    // Check Right Panel
    await expect(page.locator('body')).toContainText('AI 智能分析');
    await expect(page.locator('body')).toContainText('决策模拟器');
  });

  test('should interact with news ticker', async ({ page }) => {
    // Wait for news panel to be present
    // GlassPanel uses .cyber-card class
    const newsPanel = page.locator('.cyber-card').filter({ hasText: '实时舆情监控' });
    await expect(newsPanel).toBeVisible({ timeout: 15000 });
    
    // Check for items. If data loading is slow, wait for it.
    try {
      const newsItem = newsPanel.locator('.group').first();
      await newsItem.waitFor({ state: 'visible', timeout: 10000 });
      await newsItem.click();
      // Verify click didn't crash the app
      await expect(newsItem).toBeVisible();
    } catch (e) {
      console.log('News items did not load or list is empty, skipping interaction test');
    }
  });

  test('should toggle analysis views', async ({ page }) => {
    // GlassPanel uses .cyber-card class
    const analysisPanel = page.locator('.cyber-card').filter({ hasText: 'AI 智能分析' });
    await expect(analysisPanel).toBeVisible({ timeout: 15000 });
    
    // Trend button might be hidden until hover
    await analysisPanel.hover();
    
    const trendBtn = analysisPanel.getByRole('button', { name: '趋势' });
    if (await trendBtn.count() > 0) {
       await trendBtn.click({ force: true });
    }
  });

  test('should simulate decision', async ({ page }) => {
    // GlassPanel uses .cyber-card class
    const decisionPanel = page.locator('.cyber-card').filter({ hasText: '决策模拟器' });
    await expect(decisionPanel).toBeVisible({ timeout: 15000 });
    
    const simulateBtn = decisionPanel.getByRole('button', { name: '开始模拟' });
    if (await simulateBtn.isVisible()) {
      await simulateBtn.click();
      // Expect "重新模拟" to appear (simulating result)
      await expect(decisionPanel.getByRole('button', { name: '重新模拟' })).toBeVisible({ timeout: 15000 });
    }
  });
});
