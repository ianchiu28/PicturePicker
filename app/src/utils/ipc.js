const { ipcMain } = require("electron");

const WindowSingleton = require("./window");
const { savePicturesToDB, loadPicturesFromDB, getPicturesByIndex, getPicturesRankMap, updatePictureRank, exportHighestRankingPictures } = require("./pictures");

function initializeIpc () {
	ipcMain.handle("save-pictures", async () => {
		const folderPath = await WindowSingleton.getInstance().openDirectory();
		if (!folderPath) return;
		
		const type = await savePicturesToDB(folderPath);
		await loadPicturesFromDB(type);
	});

	ipcMain.handle("reload-pictures", (_event, index, rank) => {
		const picturesInfo = getPicturesByIndex(index, rank);
		const picturesRankMap = getPicturesRankMap();
		return { ...picturesInfo, picturesRankMap };
	});

	ipcMain.handle("update-ranking", async (_event, index, rank, score) => {
		await updatePictureRank(index, rank, score);
	});

	ipcMain.handle("export-highest-ranking-pictures", exportHighestRankingPictures);
}

module.exports = { initializeIpc };
