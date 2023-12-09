const { ipcMain } = require("electron");

const pictureUtils = require("./picture");
const WindowSingleton = require("./window");

const savePictures = async () => {
	const folderPath = await WindowSingleton.getInstance().openDirectory();
	if (!folderPath) return;
	
	const type = await pictureUtils.savePicturesToDB(folderPath);
	await pictureUtils.loadPicturesFromDB(type);
};

const reloadPictures = (_event, index, rank) => {
	const picturesInfo = pictureUtils.getPicturesByIndex(index, rank);
	const picturesRankMap = pictureUtils.getPicturesRankMap();
	return { ...picturesInfo, picturesRankMap };
};

const updateRank = async (_event, index, rank, score) => {
	await pictureUtils.updatePictureRank(index, rank, score);
};

const exportHighestRankPictures = pictureUtils.exportHighestRankPictures;

const initializeIpc = () => {
	ipcMain.handle("savePictures", savePictures);
	ipcMain.handle("reloadPictures", reloadPictures);
	ipcMain.handle("updateRank", updateRank);
	ipcMain.handle("exportHighestRankPictures", exportHighestRankPictures);
};

module.exports = { initializeIpc };
