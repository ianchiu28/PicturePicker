// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");

const DatabaseSingleton = require("../src/utils/database");
const { initializeIpc } = require("../src/utils/ipc");
const { loadPicturesFromDB } = require("../src/utils/picture");
const WindowSingleton = require("../src/utils/window");

const database = DatabaseSingleton.getInstance();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	await database.connect();
	await database.initialize();

	WindowSingleton.getInstance().initialize();
	initializeIpc();

	await loadPicturesFromDB();

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	})
})

app.on("before-quit", async () => {
	await database.close();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
