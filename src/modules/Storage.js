const fs = require('fs');

const loadIfPresent = (path) => {
    if (fs.existsSync(path)) {
        var data = JSON.parse(fs.readFileSync(path));
        console.log(`${data.length} offers loaded from file`);
        return data;
    }
}

const save = (path, data) => {
    const jsonContent = JSON.stringify(data);
    fs.writeFile(path, jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`${data.length} offers saved to ${path}`);
    });

}

module.exports = { loadIfPresent, save }