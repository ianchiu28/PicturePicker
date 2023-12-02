const { dialog } = require("electron");
const fs = require("fs");

const { insertPictures } = require("./database");

const DEFAULT_RANK = 0;

async function loadImagesFromFolder(mainWindow) {
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
}

module.exports = {
    loadImagesFromFolder
};
