/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {})

const setIpcInvoke = (funcName) => (...args) => ipcRenderer.invoke(funcName, ...args);

contextBridge.exposeInMainWorld("electron", {
    savePictures: setIpcInvoke("savePictures"),
    reloadPictures: setIpcInvoke("reloadPictures"),
    updateRank: setIpcInvoke("updateRank"),
    exportHighestRankPictures: setIpcInvoke("exportHighestRankPictures")
});
