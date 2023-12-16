const { ipcMain } = require("electron");

const pictureService = require("../src/services/picture.service");

const IPC_FUNCTIONS_MAP = {
	"savePictures": pictureService.savePicturesToDB,
	"loadPictures": pictureService.loadPicturesFromDB,
	"updatePictureRank": pictureService.updatePictureRank,
	"exportHighestRankPictures": pictureService.exportHighestRankPictures
};

const setIpcHandle = ([key, func]) =>
	ipcMain.handle(key, (_event, ...args) => func(...args));

const initializeIpc = () =>
	Object.entries(IPC_FUNCTIONS_MAP).forEach(setIpcHandle);

module.exports = { initializeIpc };
