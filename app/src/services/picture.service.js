const pictureModel = require("../models/picture.model");
const { getFiles, writeFile } = require("../utils/fs");
const WindowSingleton = require("../utils/window");

const DEFAULT_RANK = 0;
const picturesRankMap = {};

const savePicturesToDB = async (folderPath) => {
    const type = folderPath.split("\\").pop();
    const files = getFiles(folderPath);
    const pictures = files.map((file) => [
        file.split(".").shift(),
        `${folderPath}\\${file}`,
        type,
        DEFAULT_RANK
    ]);

    await pictureModel.insertPictures(pictures);
    return type;
};

const loadPicturesFromDB = async (type) => {
    const pictures = await pictureModel.getPicturesByType(type);
    for (const picture of pictures) {
        if (picturesRankMap[picture.rank]) {
            picturesRankMap[picture.rank].push(picture);
        } else {
            picturesRankMap[picture.rank] = [picture];
        }
    }
};

const reloadPictures = (index = 0, rank = 0) => {
    const pictures = [];
    for (let i = index - 2; i < index + 3; i++) {
        const picture = picturesRankMap?.[rank]?.[i] || {};
        pictures.push(picture);
    }

    const picturesRankCount = Object.entries(picturesRankMap)
        .reduce((acc, [key, values]) => {
            acc[key] = values.length
            return acc;
        }, {});

    return {
        pictures,
        currentIndex: index,
        currentRank: rank,
        picturesRankCount
    };
};

const updatePictureRank = async (index, rank, score) => {
    const picture = picturesRankMap[rank].splice(index, 1)[0];
    const newRank = +rank + score;

    // update database
    await pictureModel.updatePicture(picture.id, newRank);

    // update memory map
    if (picturesRankMap[newRank]) {
        picturesRankMap[newRank].push(picture);
    } else {
        picturesRankMap[newRank] = [picture];
    }
};

const exportHighestRankPictures = async () => {
    const pictures = await pictureModel.getHighestRankPicturesByType();
    const pictureNames = pictures.map(({ name }) => name).join("\n");

    writeFile("highest-pictures.txt", pictureNames);
    WindowSingleton.getInstance().showMessageBox("Success", "Export successfully!");
};

module.exports = {
    savePicturesToDB,
    loadPicturesFromDB,
    reloadPictures,
    updatePictureRank,
    exportHighestRankPictures
};
