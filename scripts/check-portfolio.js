const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // モバイルサイズに設定
  await page.setViewportSize({ width: 375, height: 812 });

  // ローカルファイルを開く
  await page.goto('file:///Users/r/projects/video-work-hub/index.html');

  // 少し待つ
  await page.waitForTimeout(2000);

  // ポートフォリオセクションまでスクロール
  await page.evaluate(() => {
    const portfolio = document.querySelector('#works');
    if (portfolio) {
      portfolio.scrollIntoView();
    }
  });

  await page.waitForTimeout(1000);

  // portfolio-videos の情報を取得
  const portfolioVideos = await page.evaluate(() => {
    const el = document.querySelector('.portfolio-videos');
    if (!el) return { error: 'portfolio-videos not found' };
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      display: styles.display,
      gridTemplateColumns: styles.gridTemplateColumns,
      gap: styles.gap,
      width: el.offsetWidth,
      height: el.offsetHeight,
      rectHeight: rect.height,
      visibility: styles.visibility,
      overflow: styles.overflow
    };
  });

  console.log('=== .portfolio-videos ===');
  console.log(JSON.stringify(portfolioVideos, null, 2));

  // portfolio-video-item の情報を取得
  const portfolioItems = await page.evaluate(() => {
    const items = document.querySelectorAll('.portfolio-video-item');
    return Array.from(items).map((el, index) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        index,
        width: el.offsetWidth,
        height: el.offsetHeight,
        rectHeight: rect.height,
        position: styles.position,
        overflow: styles.overflow,
        display: styles.display,
        visibility: styles.visibility
      };
    });
  });

  console.log('\n=== .portfolio-video-item (all) ===');
  console.log(JSON.stringify(portfolioItems, null, 2));

  // phone-frame-small の情報を取得
  const phoneFrames = await page.evaluate(() => {
    const items = document.querySelectorAll('.phone-frame-small');
    return Array.from(items).map((el, index) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        index,
        width: el.offsetWidth,
        height: el.offsetHeight,
        rectWidth: rect.width,
        rectHeight: rect.height,
        position: styles.position,
        transform: styles.transform,
        transformOrigin: styles.transformOrigin,
        maxWidth: styles.maxWidth,
        visibility: styles.visibility
      };
    });
  });

  console.log('\n=== .phone-frame-small (all) ===');
  console.log(JSON.stringify(phoneFrames, null, 2));

  // tiktok-wrapper-small の情報を取得
  const tiktokSmall = await page.evaluate(() => {
    const items = document.querySelectorAll('.tiktok-wrapper-small');
    return Array.from(items).map((el, index) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        index,
        width: el.offsetWidth,
        height: el.offsetHeight,
        maxHeight: styles.maxHeight,
        overflow: styles.overflow,
        visibility: styles.visibility
      };
    });
  });

  console.log('\n=== .tiktok-wrapper-small (all) ===');
  console.log(JSON.stringify(tiktokSmall, null, 2));

  // スクリーンショットを撮影（ポートフォリオセクション）
  await page.screenshot({ path: '/Users/r/projects/video-work-hub/scripts/portfolio-screenshot.png', fullPage: true });
  console.log('\n=== Full page screenshot saved to scripts/portfolio-screenshot.png ===');

  await browser.close();
})();
