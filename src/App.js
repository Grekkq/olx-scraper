const Scraper = require('./modules/Scraper');
const Mail = require('./modules/Mail');
const Config = require('./modules/Config');
const Storage = require('./modules/Storage');
const _ = require('lodash');
let offers = Storage.loadIfPresent(Config.localStorage);

function getOffers() {
    Scraper().then(updatedOffers => {
        updatedOffers = _.uniqBy([...updatedOffers], "url");
        const newOffers = updatedOffers.filter(n => !offers.map(o => o.url == n.url).some(i => i));
        console.log(`Got ${updatedOffers.length} in total, of which ${newOffers.length} are new`)
        if (newOffers.length) {
            console.log("Sending mail with new offers:");
            console.log(newOffers)
            Mail(newOffers);
        }
        Storage.save(Config.localStorage, updatedOffers);
    });
}

setImmediate(getOffers)
// setInterval(getOffers, Config.refreshTime);