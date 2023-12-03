/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const SCALE_FACTOR = 0.1;
const SCALE_MIN = 0.5;
const defaultPicture = "./empty.jpg";
let startScale = 1;
let startCoords = { x: 0, y: 0 };
let currentPictureIndex = 0;
let currentPictureRank = 0;
let currentPictureMin = 0;
let currentPictureMax = 0;

const mainPictureContainer = document.getElementById("main-picture-container");
const mainPicture = document.getElementById("main-picture");
const currentRanking = document.getElementById("current-ranking");
const resetButton = document.getElementById("reset-button");
const loadPictureFolder = document.getElementById("load-picture-folder");
const exportRankings = document.getElementById("export-rankings");
const previewPicture1 = document.getElementById("preview-picture-1");
const previewPicture2 = document.getElementById("preview-picture-2");
const previewPicture3 = document.getElementById("preview-picture-3");
const previewPicture4 = document.getElementById("preview-picture-4");
const previewPicture5 = document.getElementById("preview-picture-5");
const picturesRankingMap = document.getElementById("pictures-ranking-map");

mainPictureContainer.addEventListener("wheel", wheelHandler);
resetButton.addEventListener("click", resetPicture);
currentRanking.addEventListener("change", changeRanking);
loadPictureFolder.addEventListener("click", savePictures);
exportRankings.addEventListener("click", exportRankingsInTxt);
document.addEventListener("keydown", keyDown);

document.addEventListener('DOMContentLoaded', (event) => {
    reloadPictures();
});

function wheelHandler(event) {
    event.preventDefault();

    const { deltaX, deltaY } = event;
    const isZoom = deltaX === 0 && !Number.isInteger(deltaY)
    const actionFunction = isZoom ? zoom : move;
    actionFunction(event);
}

function zoom({ deltaY }) {
    if (deltaY > 0) {
        // pinch
        startScale -= SCALE_FACTOR;
    } else {
        // unpinch
        startScale += SCALE_FACTOR;
    }

    // startScale should have min size
    startScale = Math.max(SCALE_MIN, startScale);

    mainPicture.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function move({ deltaX, deltaY }) {
    startCoords.x -= deltaX;
    startCoords.y -= deltaY;

    mainPicture.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function resetPicture() {
    mainPicture.style.transform = `translate(0px, 0px) scale(1)`;
}

async function changeRanking(event) {
    const rank = event.target.value;
    await reloadPictures(0, rank);
}

async function savePictures() {
    await window.electron.savePictures();
    await reloadPictures();
}

function exportRankingsInTxt() {
    console.log("export rankings");
}

async function keyDown({ key }) {
    switch(key) {
        case "ArrowUp":
            await updateRanking(1);
            await reloadPictures(currentPictureIndex, currentPictureRank);
            break;
        case "ArrowDown":
            await updateRanking(-1);
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
    const { pictures, currentIndex, currentRank, picturesRankMap } = await window.electron.reloadPictures(index, rank);

    currentPictureIndex = currentIndex;
    currentPictureRank = currentRank;
    currentPictureMax = picturesRankMap[currentRank];

    currentRanking.value = currentPictureRank;

    previewPicture1.setAttribute("src", pictures[0].path || defaultPicture);
    previewPicture2.setAttribute("src", pictures[1].path || defaultPicture);
    previewPicture3.setAttribute("src", pictures[2].path || defaultPicture);
    previewPicture4.setAttribute("src", pictures[3].path || defaultPicture);
    previewPicture5.setAttribute("src", pictures[4].path || defaultPicture);
    mainPicture.setAttribute("src", pictures[2].path || defaultPicture);

    let rankingMapString = "";
    for (const [key, value] of Object.entries(picturesRankMap)) {
        rankingMapString += `Rank ${key}: ${value} picture(s).\n`;
    }
    picturesRankingMap.textContent = rankingMapString;
}

async function updateRanking(score) {
    await window.electron.updateRanking(currentPictureIndex, currentPictureRank, score);
}
