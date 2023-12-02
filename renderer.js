/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const SCALE_FACTOR = 0.1;
const SCALE_MIN = 0.5;
let startScale = 1;
let startCoords = { x: 0, y: 0 };

const mainImageContainer = document.getElementById("main-image-container");
const mainImage = document.getElementById("main-image");
const currentRanking = document.getElementById("current-ranking");
const resetButton = document.getElementById("reset-button");
const loadImageFolder = document.getElementById("load-image-folder");
const exportRankings = document.getElementById("export-rankings");

mainImageContainer.addEventListener("wheel", wheelHandler);
resetButton.addEventListener("click", resetImage);
currentRanking.addEventListener("change", changeRanking);
loadImageFolder.addEventListener("click", loadImages);
exportRankings.addEventListener("click", exportRankingsInTxt);
document.addEventListener("keydown", keyDown);

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

    mainImage.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function move({ deltaX, deltaY }) {
    startCoords.x -= deltaX;
    startCoords.y -= deltaY;

    mainImage.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function resetImage() {
    mainImage.style.transform = `translate(0px, 0px) scale(1)`;
}

function changeRanking(event) {
    const selectedOption = event.target.value;
    console.log('Selected option:', selectedOption);
}

function loadImages() {
    window.electron.loadImages();
}

function exportRankingsInTxt() {
    console.log("export rankings");
}

function keyDown({ key }) {
    switch(key) {
        case "ArrowUp":
            console.log("ArrowUp pressed");
            break;
        case "ArrowDown":
            console.log("ArrowDown pressed");
            break;
        case "ArrowLeft":
            console.log("ArrowLeft pressed");
            break;
        case "ArrowRight":
            console.log("ArrowRight pressed");
            break;
        default:
            break;
    }
}
