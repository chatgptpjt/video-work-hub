const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // モバイルサイズに設定
  await page.setViewportSize({ width: 375, height: 812 });

  // ローカルファイルを開く
  await page.goto('file:///Users/r/projects/video-work-hub/index.html');

  // 少し待ってTikTok埋め込みが読み込まれるのを待つ
  await page.waitForTimeout(2000);

  // hero-content の情報を取得
  const heroContent = await page.evaluate(() => {
    const el = document.querySelector('.hero-content');
    const styles = window.getComputedStyle(el);
    return {
      display: styles.display,
      flexDirection: styles.flexDirection,
      gap: styles.gap,
      padding: styles.padding,
      width: el.offsetWidth,
      justifyContent: styles.justifyContent,
      alignItems: styles.alignItems
    };
  });

  console.log('=== .hero-content ===');
  console.log(JSON.stringify(heroContent, null, 2));

  // hero-video の情報を取得
  const heroVideo = await page.evaluate(() => {
    const el = document.querySelector('.hero-video');
    if (!el) return null;
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: styles.width,
      height: styles.height,
      position: styles.position,
      overflow: styles.overflow,
      flexShrink: styles.flexShrink,
      marginLeft: styles.marginLeft,
      marginRight: styles.marginRight,
      paddingLeft: styles.paddingLeft,
      paddingRight: styles.paddingRight,
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectLeft: rect.left,
      rectRight: rect.right
    };
  });

  console.log('\n=== .hero-video ===');
  console.log(JSON.stringify(heroVideo, null, 2));

  // tiktok-wrapper の情報を取得
  const tiktokWrapper = await page.evaluate(() => {
    const el = document.querySelector('.tiktok-wrapper');
    if (!el) return null;
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: styles.width,
      height: styles.height,
      maxWidth: styles.maxWidth,
      maxHeight: styles.maxHeight,
      transform: styles.transform,
      transformOrigin: styles.transformOrigin,
      position: styles.position,
      rectWidth: rect.width,
      rectHeight: rect.height
    };
  });

  console.log('\n=== .tiktok-wrapper ===');
  console.log(JSON.stringify(tiktokWrapper, null, 2));

  // hero-text の情報を取得
  const heroText = await page.evaluate(() => {
    const el = document.querySelector('.hero-text');
    if (!el) return null;
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      flex: styles.flex,
      width: styles.width,
      minWidth: styles.minWidth,
      marginLeft: styles.marginLeft,
      marginRight: styles.marginRight,
      paddingLeft: styles.paddingLeft,
      paddingRight: styles.paddingRight,
      rectWidth: rect.width,
      rectLeft: rect.left
    };
  });

  console.log('\n=== .hero-text ===');
  console.log(JSON.stringify(heroText, null, 2));

  // hero セクション全体
  const hero = await page.evaluate(() => {
    const el = document.querySelector('.hero');
    if (!el) return null;
    const styles = window.getComputedStyle(el);
    return {
      padding: styles.padding,
      width: el.offsetWidth
    };
  });

  console.log('\n=== .hero ===');
  console.log(JSON.stringify(hero, null, 2));

  // スクリーンショットを撮影
  await page.screenshot({ path: '/Users/r/projects/video-work-hub/scripts/mobile-screenshot.png', fullPage: false });
  console.log('\n=== Screenshot saved to scripts/mobile-screenshot.png ===');

  await browser.close();
})();
