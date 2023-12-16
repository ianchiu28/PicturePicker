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

const savePictures = async () => {
    await window.electron.savePictures();
    await reloadPictures();
};

const changeRank = async (event) => {
    await reloadPictures(0, event.target.value);
};

const exportHighestRankPictures = () => {
    window.electron.exportHighestRankPictures();
};

const updateRank = async (score) => {
    await window.electron.updateRank(currentPictureIndex, currentPictureRank, score);
};

const keyDown = async ({ key }) => {
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
};

// UI operation
$("#load-picture-folder").on("click", savePictures);
$("#current-rank").on("change", changeRank);
$("#export-highest-rank-pictures").on("click", exportHighestRankPictures);

// Picture operation
$("#main-picture-container").on("wheel", wheelHandler);
$("#reset-picture").on("click", resetPicture);

// Keyboard operation
$(document).on("keydown", keyDown);

// Content loaded
$(document).ready(() => {
    reloadPictures();
});
