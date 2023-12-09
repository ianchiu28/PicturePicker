const { ipcMain } = require("electron");

const pictureService = require("../services/picture.service");
const WindowSingleton = require("./window");

const savePictures = async () => {
	const folderPath = await WindowSingleton.getInstance().openDirectory();
	if (!folderPath) return;
	
	const type = await pictureService.savePicturesToDB(folderPath);
	await pictureService.loadPicturesFromDB(type);
};

const reloadPictures = (_event, index, rank) => {
	const picturesInfo = pictureService.getPicturesByIndex(index, rank);
	const picturesRankMap = pictureService.getPicturesRankMap();
	return { ...picturesInfo, picturesRankMap };
};

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
