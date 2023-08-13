const Scraper = require('./modules/Scraper');
const Mail = require('./modules/Mail');
const Config = require('./modules/Config');
const _ = require('lodash');
const fs = require('fs');
let offers = [];

if (fs.existsSync(Config.localStorage)) {
    var data = JSON.parse(fs.readFileSync(Config.localStorage));
    if (data) {
        offers = data
    }
    console.log("Offers loaded from file")
}

function getOffers() {
    Scraper().then(updatedOffers => {
        updatedOffers = _.uniqBy([...updatedOffers], "url");
        newOffers = updatedOffers.filter(n => !offers.map(o => o.url == n.url).some(i => i));
        console.log(newOffers);
        if (newOffers.length) {
            console.log("Sending mail with new offers")
            Mail(newOffers);
        }
        const jsonContent = JSON.stringify(offers);
        fs.writeFile(Config.localStorage, jsonContent, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
}

setImmediate(getOffers)
// setInterval(getOffers, Config.refreshTime);