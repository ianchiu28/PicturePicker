/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', async () => {
    const { pictures } = await ipcRenderer.invoke("reload-pictures");

    const defaultPicture = "./empty.jpg";

    const mainPicture = document.getElementById("main-picture");
    const previewPicture1 = document.getElementById("preview-picture-1");
    const previewPicture2 = document.getElementById("preview-picture-2");
    const previewPicture3 = document.getElementById("preview-picture-3");
    const previewPicture4 = document.getElementById("preview-picture-4");
    const previewPicture5 = document.getElementById("preview-picture-5");

    previewPicture1.setAttribute("src", pictures[0].path || defaultPicture);
    previewPicture2.setAttribute("src", pictures[1].path || defaultPicture);
    previewPicture3.setAttribute("src", pictures[2].path || defaultPicture);
    previewPicture4.setAttribute("src", pictures[3].path || defaultPicture);
    previewPicture5.setAttribute("src", pictures[4].path || defaultPicture);
    mainPicture.setAttribute("src", pictures[2].path || defaultPicture);
})

contextBridge.exposeInMainWorld("electron", {
    savePictures: () => ipcRenderer.invoke("save-pictures"),
    reloadPictures: (index) => ipcRenderer.invoke("reload-pictures", index)
});
