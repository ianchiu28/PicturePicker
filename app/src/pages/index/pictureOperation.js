const SCALE_FACTOR = 0.1;
const SCALE_MIN = 0.5;

let startScale = 1;
let startCoords = { x: 0, y: 0 };

function wheelHandler(picture, event) {
    event.preventDefault();

    const { deltaX, deltaY } = event;
    const isZoom = deltaX === 0 && !Number.isInteger(deltaY)
    const actionFunction = isZoom ? zoom : move;
    actionFunction(picture, event);
}

function zoom(picture, { deltaY }) {
    if (deltaY > 0) {
        // pinch
        startScale -= SCALE_FACTOR;
    } else {
        // unpinch
        startScale += SCALE_FACTOR;
    }

    // startScale should have min size
    startScale = Math.max(SCALE_MIN, startScale);

    picture.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function move(picture, { deltaX, deltaY }) {
    startCoords.x -= deltaX;
    startCoords.y -= deltaY;

    picture.style.transform = `translate(${startCoords.x}px, ${startCoords.y}px) scale(${startScale})`;
}

function resetPicture(picture) {
    picture.style.transform = `translate(0px, 0px) scale(1)`;
}