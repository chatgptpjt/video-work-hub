const { chromium } = require('playwright');

async function main() {
  console.log('ブラウザを起動中...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();

  console.log('CrowdWorksにアクセス中...');

  // CrowdWorksのグルメ動画関連検索（募集中のみ）
  await page.goto('https://crowdworks.jp/public/jobs?category_id=&order=new&hide_expired=true&search%5Bkeywords%5D=%E3%82%B0%E3%83%AB%E3%83%A1%20%E5%8B%95%E7%94%BB', {
    waitUntil: 'load',
    timeout: 60000
  });

  console.log('ページ読み込み完了');
  console.log('ブラウザを開いたままにします。Ctrl+Cで終了してください。');

  // 5分間待機（その間に手動で操作可能）
  await page.waitForTimeout(300000);

  await browser.close();
}

main().catch(e => {
  console.error('エラー:', e.message);
});
