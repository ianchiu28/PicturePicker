/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const SCALE_FACTOR = 0.1;
const SCALE_MIN = 0.1;
const SCALE_MAX = 10;
let startScale = 1;
let startCoords = { x: 0, y: 0 };

const mainImageContainer = document.getElementById("main-image-container");
const mainImage = document.getElementById("main-image");
const resetButton = document.getElementById("reset-button");

mainImageContainer.addEventListener("wheel", wheelHandler);
resetButton.addEventListener("click", resetImage);

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

    // startScale should within a range
    startScale = Math.max(SCALE_MIN, Math.min(startScale, SCALE_MAX));

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
