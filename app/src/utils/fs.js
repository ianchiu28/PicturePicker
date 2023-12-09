const fs = require("fs");

const getFiles = (folderPath) => fs.readdirSync(folderPath);

const writeFile = (filename, text) => fs.writeFileSync(filename, text);

module.exports = {
    getFiles,
    writeFile
};
