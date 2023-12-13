/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const defaultPicture = "../../../../resources/images/empty.jpg";
let currentPictureIndex = 0;
let currentPictureRank = 0;
let currentPictureMin = 0;
let currentPictureMax = 0;

const mainPicture = document.getElementById("main-picture");
const currentRanking = document.getElementById("current-ranking");
const loadPictureFolder = document.getElementById("load-picture-folder");
const exportHighestRankingPictures = document.getElementById("export-highest-ranking-pictures");
const previewPicture1 = document.getElementById("preview-picture-1");
const previewPicture2 = document.getElementById("preview-picture-2");
const previewPicture3 = document.getElementById("preview-picture-3");
const previewPicture4 = document.getElementById("preview-picture-4");
const previewPicture5 = document.getElementById("preview-picture-5");
const picturesRankingMap = document.getElementById("pictures-ranking-map");

currentRanking.addEventListener("change", changeRanking);
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

async function reloadPictures(index, rank) {
    const { pictures, currentIndex, currentRank, picturesRankCount } = await window.electron.reloadPictures(index, rank);

    currentPictureIndex = currentIndex;
    currentPictureRank = currentRank;
    currentPictureMax = picturesRankCount[currentRank];

    currentRanking.value = currentPictureRank;

    previewPicture1.setAttribute("src", pictures[0].path || defaultPicture);
    previewPicture2.setAttribute("src", pictures[1].path || defaultPicture);
    previewPicture3.setAttribute("src", pictures[2].path || defaultPicture);
    previewPicture4.setAttribute("src", pictures[3].path || defaultPicture);
    previewPicture5.setAttribute("src", pictures[4].path || defaultPicture);
    mainPicture.setAttribute("src", pictures[2].path || defaultPicture);

    const picturesRankArray = Object.entries(picturesRankCount).sort(([a], [b]) => +b - +a);
    let rankingMapString = "";
    for (const [key, value] of picturesRankArray) {
        rankingMapString += `Rank ${key}: ${value} picture(s).\n`;
    }
    picturesRankingMap.textContent = rankingMapString;
}

async function updateRank(score) {
    await window.electron.updateRank(currentPictureIndex, currentPictureRank, score);
}
