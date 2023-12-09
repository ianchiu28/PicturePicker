/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {})

contextBridge.exposeInMainWorld("electron", {
    savePictures: () => ipcRenderer.invoke("savePictures"),
    reloadPictures: (index, rank) => ipcRenderer.invoke("reloadPictures", index, rank),
    updateRank: (index, rank, score) => ipcRenderer.invoke("updateRank", index, rank, score),
    exportHighestRankPictures: () => ipcRenderer.invoke("exportHighestRankPictures")
});
