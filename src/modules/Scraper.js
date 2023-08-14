const puppeteer = require('puppeteer');
const Config = require('./Config');

module.exports = async () => {
    let options = {};
    if (Config.debug) {
        options = { ...options, headless: false, slowMo: 250 };
    }
    if (Config.chromiumPath?.length > 0) {
        options = { ...options, executablePath: Config.chromiumPath };
    }
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(Config.pageURL);
    let fetchedOffers = await extractOffers(page);
    console.log(`page 1 scraped records: ${fetchedOffers.length}`);
    for (let i = 2; i <= Config.numberOfPages; i++) {
        await page.goto(Config.pageURL.replace("?search", `?page=${i}`));
        const anotherFetchedOffers = await extractOffers(page);
        fetchedOffers = fetchedOffers.concat(anotherFetchedOffers);
        console.log(`page ${i} scraped, record: ${anotherFetchedOffers.length}`);
    }
    await browser.close();
    return fetchedOffers;
};

async function extractOffers(page) {
    new Promise(r => setTimeout(r, 6000))
    return await page.evaluate(() => {
        const offers = Array.from(document.querySelectorAll(`[data-testid="location-date"]`));
        return offers.map(offer => {
            let almostTitle = offer.parentElement.parentElement;
            let url = almostTitle.parentElement.parentElement.parentElement.getAttribute('href');
            if (url.startsWith("/d")) {
                url = `https://www.olx.pl${url}`;
            }
            return {
                title: almostTitle.firstElementChild.firstElementChild.innerText,
                url: url,
                price: almostTitle.firstElementChild.lastElementChild.innerText,
                location: almostTitle.innerText
            };
        });
    });
}