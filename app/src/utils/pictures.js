const { dialog } = require("electron");
const fs = require("fs");

const { insertPictures, fetchPictures, updatePicture, fetchHighestRankPictures } = require("./database");

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
    const pictures = [];
    for (let i = index - 2; i < index + 3; i++) {
        const picture = picturesRankMap?.[rank]?.[i] || {};
        pictures.push(picture);
    }

    return { pictures, currentIndex: index, currentRank: rank };
}

function getPicturesRankMap() {
    return Object.entries(picturesRankMap)
        .reduce((acc, [key, values]) => {
            acc[key] = values.length
            return acc;
        }, {});
}

async function updatePictureRank(index, rank, score) {
    const picture = picturesRankMap[rank].splice(index, 1)[0];
    const newRank = +rank + score;
    await updatePicture(picture.id, newRank);

    if (picturesRankMap[newRank]) {
        picturesRankMap[newRank].push(picture);
    } else {
        picturesRankMap[newRank] = [picture];
    }
}

async function exportHighestRankingPictures() {
    const pictures = await fetchHighestRankPictures();
    const pictureNames = pictures.map(({ name }) => name).join("\n");

    fs.writeFile("highest-pictures.txt", pictureNames, (err) => {
        if (err) {
            console.error("write file error:", err);
            return;
        }
        console.log("write file successfully");
    });
}

module.exports = {
    savePicturesToDB,
    loadPicturesFromDB,
    getPicturesByIndex,
    getPicturesRankMap,
    updatePictureRank,
    exportHighestRankingPictures
};
