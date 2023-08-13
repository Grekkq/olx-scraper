const puppeteer = require('puppeteer');
const Config = require('./Config');

module.exports = async () => {
    console.log("browser launch")
    const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
    console.log("browser launched")
    const page = await browser.newPage();
    await page.goto(Config.pageURL);
    console.log("page loaded")
    new Promise(r => setTimeout(r, 6000))
    const fetchedOffers = await page.evaluate(() => {
        const offers = Array.from(document.querySelectorAll(`[data-testid="location-date"]`));
        const offersTitles = offers.map(offer => {
            almostTitle = offer.parentElement.parentElement
            url = almostTitle.parentElement.parentElement.parentElement.getAttribute('href')
            if (url.startsWith("/d")) {
                url = "https://www.olx.pl" + url
            }
            return {
                title: almostTitle.firstElementChild.firstElementChild.innerText,
                url: url,
                price: almostTitle.firstElementChild.lastElementChild.innerText,
                location: almostTitle.innerText
            };
        });
        return offersTitles;
    });
    await page.goto(Config.pageURL.replace("?search", "?page=2"));
    const anotherFetchedOffers = await page.evaluate(() => {
        const offers = Array.from(document.querySelectorAll(`[data-testid="location-date"]`));
        const offersTitles = offers.map(offer => {
            almostTitle = offer.parentElement.parentElement
            url = almostTitle.parentElement.parentElement.parentElement.getAttribute('href')
            if (url.startsWith("/d")) {
                url = "https://www.olx.pl" + url
            }
            return {
                title: almostTitle.firstElementChild.firstElementChild.innerText,
                url: url,
                price: almostTitle.firstElementChild.lastElementChild.innerText,
                location: almostTitle.innerText
            };
        });
        return offersTitles;
    });
    console.log("offerts fetched")
    var merged = [...fetchedOffers];
    merged.concat(anotherFetchedOffers);
    // console.log(merged)
    await browser.close();
    return merged;
};