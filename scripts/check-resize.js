const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // デスクトップサイズで開始
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('file:///Users/r/projects/video-work-hub/index.html');
  await page.waitForTimeout(2000);

  // ポートフォリオまでスクロール
  await page.evaluate(() => {
    document.querySelector('#works').scrollIntoView();
  });
  await page.waitForTimeout(1000);

  console.log('=== Before resize (1200px) ===');
  await page.screenshot({ path: '/Users/r/projects/video-work-hub/scripts/before-resize.png' });

  // デスクトップでのサイズ確認
  let data = await page.evaluate(() => {
    const items = document.querySelectorAll('.portfolio-video-item');
    return Array.from(items).map((el, i) => ({
      index: i,
      width: el.offsetWidth,
      height: el.offsetHeight,
      display: window.getComputedStyle(el).display
    }));
  });
  console.log('portfolio-video-items:', JSON.stringify(data, null, 2));

  // モバイルサイズにリサイズ
  console.log('\n=== Resizing to 375px... ===');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(2000);

  // ポートフォリオまでスクロール
  await page.evaluate(() => {
    document.querySelector('#works').scrollIntoView();
  });
  await page.waitForTimeout(1000);

  console.log('=== After resize (375px) ===');
  await page.screenshot({ path: '/Users/r/projects/video-work-hub/scripts/after-resize.png' });

  // モバイルでのサイズ確認
  data = await page.evaluate(() => {
    const items = document.querySelectorAll('.portfolio-video-item');
    return Array.from(items).map((el, i) => {
      const rect = el.getBoundingClientRect();
      return {
        index: i,
        width: el.offsetWidth,
        height: el.offsetHeight,
        display: window.getComputedStyle(el).display,
        rectWidth: rect.width,
        rectHeight: rect.height,
        isVisible: rect.width > 0 && rect.height > 0
      };
    });
  });
  console.log('portfolio-video-items:', JSON.stringify(data, null, 2));

  // phone-frame-smallの確認
  const frames = await page.evaluate(() => {
    const items = document.querySelectorAll('.phone-frame-small');
    return Array.from(items).map((el, i) => {
      const rect = el.getBoundingClientRect();
      return {
        index: i,
        width: el.offsetWidth,
        rectWidth: rect.width,
        isVisible: rect.width > 0
      };
    });
  });
  console.log('phone-frame-small:', JSON.stringify(frames, null, 2));

  await browser.close();
})();
