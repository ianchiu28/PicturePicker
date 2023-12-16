/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
import { wheelHandler, resetPicture } from "./pictureOperation.js";
import {
    currentPictureIndex,
    currentPictureRank,
    currentPictureMin,
    currentPictureMax,
    reloadPictures
} from "./pictureUtil.js"

const currentRank = document.getElementById("current-rank");
const loadPictureFolder = document.getElementById("load-picture-folder");
const exportHighestRankingPictures = document.getElementById("export-highest-ranking-pictures");

currentRank.addEventListener("change", changeRanking);
loadPictureFolder.addEventListener("click", savePictures);
exportHighestRankingPictures.addEventListener("click", exportRankingsInTxt);
document.addEventListener("keydown", keyDown);

// picture operation
document
    .getElementById("main-picture-container")
    .addEventListener("wheel", wheelHandler);
document
    .getElementById("reset-picture")
    .addEventListener("click", resetPicture);

// content loaded
document.addEventListener('DOMContentLoaded', (event) => {
    reloadPictures();
});

async function changeRanking(event) {
    const rank = event.target.value;
    await reloadPictures(0, rank);
}

async function savePictures() {
    await window.electron.savePictures();
    await reloadPictures();
}

function exportRankingsInTxt() {
    window.electron.exportHighestRankPictures();
}

async function keyDown({ key }) {
    switch(key) {
        case "ArrowUp":
            await updateRank(1);
            await reloadPictures(currentPictureIndex, currentPictureRank);
            break;
        case "ArrowDown":
            await updateRank(-1);
            await reloadPictures(currentPictureIndex, currentPictureRank);
            break;
        case "ArrowLeft":
            if (currentPictureIndex <= currentPictureMin) return;
            await reloadPictures(currentPictureIndex - 1, currentPictureRank);
            break;
        case "ArrowRight":
            if (currentPictureIndex >= currentPictureMax - 1) return;
            await reloadPictures(currentPictureIndex + 1, currentPictureRank);
            break;
        default:
            break;
    }
}

async function updateRank(score) {
    await window.electron.updateRank(currentPictureIndex, currentPictureRank, score);
}
