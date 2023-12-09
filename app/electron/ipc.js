const { ipcMain } = require("electron");

const pictureService = require("../src/services/picture.service");

const savePictures = async () => 
	pictureService.savePicturesToDB();

const reloadPictures = (_event, index, rank) =>
	pictureService.reloadPictures(index, rank);

const updateRank = async (_event, index, rank, score) =>
	pictureService.updatePictureRank(index, rank, score);

const exportHighestRankPictures = pictureService.exportHighestRankPictures;

const initializeIpc = () => {
	ipcMain.handle("savePictures", savePictures);
	ipcMain.handle("reloadPictures", reloadPictures);
	ipcMain.handle("updateRank", updateRank);
	ipcMain.handle("exportHighestRankPictures", exportHighestRankPictures);
};

module.exports = { initializeIpc };
