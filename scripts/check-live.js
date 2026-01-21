const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // モバイルサイズに設定
  await page.setViewportSize({ width: 375, height: 812 });

  // ライブサイトを開く
  await page.goto('https://chatgptpjt.github.io/video-work-hub/?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });

  // 少し待つ
  await page.waitForTimeout(3000);

  // ヒーローセクションのスクリーンショット
  await page.screenshot({ path: '/Users/r/projects/video-work-hub/scripts/live-hero.png' });
  console.log('=== Hero screenshot saved ===');

  // ポートフォリオセクションまでスクロール
  await page.evaluate(() => {
    const portfolio = document.querySelector('#works');
    if (portfolio) {
      portfolio.scrollIntoView();
    }
  });

  await page.waitForTimeout(2000);

  // ポートフォリオセクションのスクリーンショット
  await page.screenshot({ path: '/Users/r/projects/video-work-hub/scripts/live-portfolio.png' });
  console.log('=== Portfolio screenshot saved ===');

  // CSSが正しく読み込まれているか確認
  const heroVideo = await page.evaluate(() => {
    const el = document.querySelector('.hero-video');
    if (!el) return { error: 'hero-video not found' };
    const styles = window.getComputedStyle(el);
    return {
      width: styles.width,
      height: styles.height,
      position: styles.position,
      overflow: styles.overflow
    };
  });
  console.log('\n=== .hero-video (LIVE) ===');
  console.log(JSON.stringify(heroVideo, null, 2));

  const tiktokWrapper = await page.evaluate(() => {
    const el = document.querySelector('.tiktok-wrapper');
    if (!el) return { error: 'tiktok-wrapper not found' };
    const styles = window.getComputedStyle(el);
    return {
      width: styles.width,
      maxWidth: styles.maxWidth,
      transform: styles.transform,
      position: styles.position
    };
  });
  console.log('\n=== .tiktok-wrapper (LIVE) ===');
  console.log(JSON.stringify(tiktokWrapper, null, 2));

  const portfolioItem = await page.evaluate(() => {
    const el = document.querySelector('.portfolio-video-item');
    if (!el) return { error: 'portfolio-video-item not found' };
    const styles = window.getComputedStyle(el);
    return {
      width: styles.width,
      height: styles.height,
      display: styles.display,
      overflow: styles.overflow
    };
  });
  console.log('\n=== .portfolio-video-item (LIVE) ===');
  console.log(JSON.stringify(portfolioItem, null, 2));

  const phoneFrameSmall = await page.evaluate(() => {
    const el = document.querySelector('.phone-frame-small');
    if (!el) return { error: 'phone-frame-small not found' };
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: styles.width,
      height: styles.height,
      position: styles.position,
      transform: styles.transform,
      rectWidth: rect.width,
      rectHeight: rect.height
    };
  });
  console.log('\n=== .phone-frame-small (LIVE) ===');
  console.log(JSON.stringify(phoneFrameSmall, null, 2));

  await browser.close();
})();
