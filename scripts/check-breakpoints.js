const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const widths = [1200, 1024, 900, 768, 600, 480, 375];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('file:///Users/r/projects/video-work-hub/index.html');
    await page.waitForTimeout(1000);

    // ポートフォリオセクションまでスクロール
    await page.evaluate(() => {
      const portfolio = document.querySelector('#works');
      if (portfolio) portfolio.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const item = document.querySelector('.portfolio-video-item');
      const frame = document.querySelector('.phone-frame-small');
      const wrapper = document.querySelector('.tiktok-wrapper-small');

      const getStyles = (el) => {
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          width: styles.width,
          height: styles.height,
          display: styles.display,
          position: styles.position,
          visibility: styles.visibility,
          opacity: styles.opacity,
          rectWidth: rect.width,
          rectHeight: rect.height
        };
      };

      return {
        portfolioItem: getStyles(item),
        phoneFrame: getStyles(frame),
        tiktokWrapper: getStyles(wrapper)
      };
    });

    console.log(`\n=== Width: ${width}px ===`);
    console.log('portfolio-video-item:', JSON.stringify(data.portfolioItem, null, 2));
    console.log('phone-frame-small:', JSON.stringify(data.phoneFrame, null, 2));

    // スクリーンショット
    await page.screenshot({ path: `/Users/r/projects/video-work-hub/scripts/width-${width}.png` });
  }

  await browser.close();
  console.log('\n=== Done ===');
})();
