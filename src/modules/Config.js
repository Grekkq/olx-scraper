module.exports = {
    refreshTime: 600000,
    pageURL: process.env.pageUrl,
    numberOfPages: 2,
    mailConnection: {
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.mailUser,
            pass: process.env.mailPass
        }
    },
    mailMessage: {
        from: 'wojtek@rockandcode.pl',
        to: 'wojtek@rockandcode.pl',
        subject: 'Nowe oferty z olx'
    },
    localStorage: "./tmp/offers.json",
    chromiumPath: process.env.chromiumPath,
    debug: true
};