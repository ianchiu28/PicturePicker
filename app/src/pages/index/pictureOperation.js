const SCALE_FACTOR = 0.1;
const SCALE_MIN = 0.5;

let startScale = 1;
let startCoords = { x: 0, y: 0 };

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

    const mainPicture = document.getElementById("main-picture");
    mainPicture.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function move({ deltaX, deltaY }) {
    startCoords.x -= deltaX;
    startCoords.y -= deltaY;

    const mainPicture = document.getElementById("main-picture");
    mainPicture.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function resetPicture() {
    const mainPicture = document.getElementById("main-picture");
    mainPicture.style.transform = `translate(0px, 0px) scale(1)`;
}