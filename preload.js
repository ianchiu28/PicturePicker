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
    loadImages: () => ipcRenderer.invoke("load-images")
});
