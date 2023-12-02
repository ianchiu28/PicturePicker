const { dialog } = require("electron");
const fs = require("fs");

const { insertPictures, fetchPictures } = require("./database");

const DEFAULT_RANK = 0;

const picturesRankMap = {};

async function savePicturesToDB(mainWindow) {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"]
    });

    if (canceled) return;

    const folderPath = filePaths[0];
    const type = folderPath.split("\\").pop();
    const files = fs.readdirSync(folderPath);
    const pictures = files.map((file) => [
        file.split(".").shift(),
        `${folderPath}\\${file}`,
        type,
        DEFAULT_RANK
    ]);

    await insertPictures(pictures);
    return type;
}

async function loadPicturesFromDB(type) {
    const pictures = await fetchPictures(type);
    for (const picture of pictures) {
        if (picturesRankMap[picture.rank]) {
            picturesRankMap[picture.rank].push(picture);
        } else {
            picturesRankMap[picture.rank] = [picture];
        }
    }
}

function getPicturesByIndex(index = 0, rank = 0) {
    const outputPictures = [];
    for (let i = index - 2; i < index + 3; i++) {
        const picture = picturesRankMap[rank][i] || {};
        outputPictures.push(picture);
    }
    return outputPictures;
}

module.exports = {
    savePicturesToDB,
    loadPicturesFromDB,
    getPicturesByIndex
};
