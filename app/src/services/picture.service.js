const pictureModel = require("../models/picture.model");
const { getFiles, writeFile } = require("../utils/fs");
const WindowSingleton = require("../utils/window");

const DEFAULT_RANK = 0;

const savePicturesToDB = async () => {
    const folderPath = await WindowSingleton.getInstance().openDirectory();
	if (!folderPath) return;

    const type = folderPath.split("\\").pop();
    const files = getFiles(folderPath);
    const pictures = files.map((file) => [
        file.split(".").shift(),
        `${folderPath}\\${file}`,
        type,
        DEFAULT_RANK
    ]);

    await pictureModel.insertPictures(pictures);
};

const loadPicturesFromDB = async (type) => {
    return pictureModel.getPicturesByType(type);
};

const updatePictureRank = async (pictureId, newRank) => {
    await pictureModel.updatePicture(pictureId, newRank);
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
    updatePictureRank,
    exportHighestRankPictures
};
