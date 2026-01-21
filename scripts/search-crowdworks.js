const { chromium } = require('playwright');

async function searchCrowdWorks() {
  const browser = await chromium.launch({
    headless: false,  // ブラウザを表示
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const results = [];
  const seenUrls = new Set();

  // 検索キーワードリスト
  const keywords = [
    'グルメ 動画',
    '飲食 動画編集',
    'グルメ ショート',
    '食べ物 リール',
    'Instagram 動画編集',
  ];

  for (const keyword of keywords) {
    if (results.length >= 30) break;

    try {
      const searchUrl = `https://crowdworks.jp/public/jobs?order=new&hide_expired=true&search%5Bkeywords%5D=${encodeURIComponent(keyword)}`;

      console.error(`Searching: ${keyword}`);
      await page.goto(searchUrl, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(3000);

      // すべてのリンクからジョブURLを抽出
      const jobs = await page.evaluate(() => {
        const allLinks = Array.from(document.querySelectorAll('a'));
        const jobMap = new Map();

        allLinks.forEach(a => {
          const href = a.getAttribute('href');
          if (href && href.includes('/public/jobs/')) {
            const match = href.match(/\/public\/jobs\/(\d+)/);
            if (match) {
              const id = match[1];
              if (!jobMap.has(id)) {
                let parent = a.closest('li') || a.closest('div') || a.parentElement;
                let title = a.textContent.trim();
                let price = '';

                if (title.length < 5 && parent) {
                  const texts = parent.textContent.trim();
                  if (texts.length > 5) {
                    title = texts.slice(0, 100);
                  }
                }

                if (parent) {
                  const priceMatch = parent.textContent.match(/[\d,]+円|¥[\d,]+/);
                  if (priceMatch) {
                    price = priceMatch[0];
                  }
                }

                if (title && title.length > 3) {
                  jobMap.set(id, {
                    id,
                    url: `https://crowdworks.jp/public/jobs/${id}`,
                    title: title.replace(/\s+/g, ' ').slice(0, 100),
                    price
                  });
                }
              }
            }
          }
        });

        return Array.from(jobMap.values());
      });

      for (const job of jobs) {
        if (!seenUrls.has(job.url) && results.length < 30) {
          seenUrls.add(job.url);
          results.push(job);
        }
      }

      console.error(`[${keyword}] Found ${jobs.length} jobs, Total unique: ${results.length}`);

    } catch (e) {
      console.error(`Error searching "${keyword}":`, e.message);
    }
  }

  // 各案件の詳細を取得
  console.error('\nFetching job details...');
  const detailedResults = [];

  for (const job of results.slice(0, 25)) {
    try {
      await page.goto(job.url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000);

      const details = await page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : '';

        let price = '';
        const allText = document.body.textContent;
        const priceMatches = allText.match(/固定報酬制[\s\S]*?([\d,]+円～[\d,]+円|[\d,]+円)/);
        if (priceMatches) {
          price = priceMatches[0].slice(0, 50);
        } else {
          const simplePrice = allText.match(/([\d,]+円)\s*[\/〜]/);
          if (simplePrice) {
            price = simplePrice[1];
          }
        }

        const bodyText = document.body.textContent.replace(/\s+/g, ' ');
        let desc = bodyText.slice(0, 300);

        return { title, price, desc };
      });

      detailedResults.push({
        url: job.url,
        title: details.title || job.title,
        price: details.price || job.price || '要確認',
        summary: details.desc || ''
      });

      console.error(`Fetched: ${job.url}`);

    } catch (e) {
      console.error(`Error fetching ${job.url}:`, e.message);
    }
  }

  await browser.close();

  console.log(JSON.stringify(detailedResults, null, 2));
}

searchCrowdWorks().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
