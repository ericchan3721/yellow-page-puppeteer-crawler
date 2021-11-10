const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    let pageNo = 1;
    const pageUrl = "https://www.yp.com.hk/Keyword/s-%E9%AB%94%E6%AA%A2/zh?Length=15&X-Requested-With=XMLHttpRequest&keyword=%E9%AB%94%E6%AA%A2&lang=zh&pageno=";

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);

	//	create export csv file
	const date = new Date(Date.now() + 8 * 60 * 60 * 1000)
						.toISOString()
						.replace(/T/g, '_')
						.replace(/\..+|-|:/g, '');
    const csvFileName = `clinic_${date}.csv`;
	fs.writeFile(csvFileName, '', 'utf8', function (err) {
		if (err) {		
			console.error('\x1b[31m%s\x1b[0m', `Write CSV error: ${err}`);
		} else {
			console.info('\x1b[32m%s\x1b[0m', 'Initial create CSV file successes.');
		}
	});

    while (true) {
        await page.goto(pageUrl + pageNo);

        const crawledCompanyData = await page.$$("div.companyInfo.responsiveDesktop");

        if (crawledCompanyData?.length > 0) {
			console.log('\x1b[36m%s\x1b[0m', `Crawling page# ${pageNo}, page data length: ${crawledCompanyData?.length}`);
            for (let i = 0; i < crawledCompanyData?.length; i++) {
                const companyTitle = await crawledCompanyData[i]?.$eval('div.companyTopInfo > div > div.companyTitle > a', (node) => node?.innerText !== "" ? node?.innerText : null);
                const companyTel = await crawledCompanyData[i]?.$eval('div.companyBasicInfo > div > div:nth-child(1) > div.companyDataValueContainer > div > a > span', (node) => node?.innerText !== "" ? node?.innerText : null);
                const companyAddress = await crawledCompanyData[i]?.$eval('div.companyBasicInfo > div > div:nth-child(2) > div.companyDataValueContainer > div > a > span', (node) => node?.innerText !== "" ? node?.innerText : null);
                const companyCategory = await crawledCompanyData[i]?.evaluate((node) => {
                    const cate = node?.querySelector('div.companyExtraInfo > div > a > span:first-child')?.innerText;
                    return (cate !== "") ? cate : null;
                });

                const csvRowStr = [`"${companyTitle}"`, `"${companyTel}"`, `"${companyAddress}"`, `"${companyCategory}"`].join(',') + "\r\n";
                fs.appendFile(csvFileName, csvRowStr, 'utf8', function (err) {
                    if (err)
                        console.error('\x1b[31m%s\x1b[0m', `Save data row error: ${err}`);
                })
            }
        } else {
            console.info('\x1b[32m%s\x1b[0m', `[Crawler] Done! Crawled ${pageNo - 1} pages!`);
            await browser.close();
            process.exit(0);
        }

        //  update page no.
        pageNo += 1;
    }
    
})();

