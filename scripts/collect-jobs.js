const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const page = await browser.newPage();
  const results = [];

  // 検索キーワードリスト
  const searches = [
    'グルメ 動画',
    '飲食 動画編集',
    'グルメ リール',
    '飲食店 ショート',
  ];

  for (const keyword of searches) {
    console.log(`\n検索中: ${keyword}`);

    const url = `https://crowdworks.jp/public/jobs?category_id=&order=new&hide_expired=true&search%5Bkeywords%5D=${encodeURIComponent(keyword)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 案件リンクを取得
    const jobLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.match(/\/public\/jobs\/\d+$/)) {
          const match = href.match(/\/public\/jobs\/(\d+)$/);
          if (match && !links.includes(match[1])) {
            links.push(match[1]);
          }
        }
      });
      return links.slice(0, 10); // 各検索から最大10件
    });

    console.log(`見つかった案件ID: ${jobLinks.join(', ')}`);

    // 各案件の詳細を取得
    for (const jobId of jobLinks) {
      if (results.length >= 15) break;
      if (results.some(r => r.id === jobId)) continue;

      const jobUrl = `https://crowdworks.jp/public/jobs/${jobId}`;
      console.log(`取得中: ${jobUrl}`);

      try {
        await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(1500);

        const jobInfo = await page.evaluate(() => {
          const body = document.body.innerText;

          // 募集終了チェック
          if (body.includes('このお仕事の募集は終了しています') ||
              body.includes('募集は終了') ||
              body.includes('募集終了')) {
            return { expired: true };
          }

          // タイトル
          const h1 = document.querySelector('h1');
          const title = h1 ? h1.innerText.trim() : '';

          // 報酬を探す
          let price = '';
          const priceMatch = body.match(/固定報酬制[^\d]*([\d,]+円[^）\n]*)/);
          if (priceMatch) {
            price = priceMatch[1];
          } else {
            const simpleMatch = body.match(/([\d,]+円).*?(税[抜込])/);
            if (simpleMatch) {
              price = simpleMatch[0];
            }
          }

          // 応募状況
          let applicants = '';
          const appMatch = body.match(/応募した人\s*(\d+)\s*人/);
          if (appMatch) {
            applicants = appMatch[1] + '人応募';
          }

          return { title, price, applicants, expired: false };
        });

        if (!jobInfo.expired && jobInfo.title) {
          results.push({
            id: jobId,
            url: jobUrl,
            title: jobInfo.title.slice(0, 80),
            price: jobInfo.price || '要確認',
            applicants: jobInfo.applicants
          });
          console.log(`✓ ${jobInfo.title.slice(0, 40)}...`);
        } else if (jobInfo.expired) {
          console.log(`✗ 募集終了`);
        }
      } catch (e) {
        console.log(`エラー: ${e.message}`);
      }
    }

    if (results.length >= 15) break;
  }

  console.log('\n\n===== 募集中の案件一覧 =====\n');
  console.log(JSON.stringify(results, null, 2));

  await page.waitForTimeout(5000);
  await browser.close();
}

main().catch(e => console.error('Fatal:', e.message));
