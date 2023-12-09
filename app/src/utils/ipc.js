const { ipcMain } = require("electron");

const pictureUtils = require("./picture");
const WindowSingleton = require("./window");

function initializeIpc () {
	ipcMain.handle("savePictures", async () => {
		const folderPath = await WindowSingleton.getInstance().openDirectory();
		if (!folderPath) return;
		
		const type = await pictureUtils.savePicturesToDB(folderPath);
		await pictureUtils.loadPicturesFromDB(type);
	});

	ipcMain.handle("reloadPictures", (_event, index, rank) => {
		const picturesInfo = pictureUtils.getPicturesByIndex(index, rank);
		const picturesRankMap = pictureUtils.getPicturesRankMap();
		return { ...picturesInfo, picturesRankMap };
	});

	ipcMain.handle("updateRank", async (_event, index, rank, score) => {
		await pictureUtils.updatePictureRank(index, rank, score);
	});

	ipcMain.handle("exportHighestRankPictures", pictureUtils.exportHighestRankPictures);
}

module.exports = { initializeIpc };
