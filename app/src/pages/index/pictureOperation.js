const SCALE_FACTOR = 0.1;
const SCALE_MIN = 0.5;

let startScale = 1;
let startCoords = { x: 0, y: 0 };

const updateMainPicture = ({ pixelX, pixelY, scale }) => {
    $("#main-picture").css("transform", `translate(${pixelX}px, ${pixelY}px) scale(${scale})`);
};

const zoom = ({ deltaY }) => {
    if (deltaY > 0) {
        // pinch
        startScale -= SCALE_FACTOR;
    } else {
        // unpinch
        startScale += SCALE_FACTOR;
    }

    // startScale should have min size
    startScale = Math.max(SCALE_MIN, startScale);

    updateMainPicture({
        pixelX: startCoords.x,
        pixelY: startCoords.y,
        scale: startScale
    });
};

const move = ({ deltaX, deltaY }) => {
    startCoords.x -= deltaX;
    startCoords.y -= deltaY;

    updateMainPicture({
        pixelX: startCoords.x,
        pixelY: startCoords.y,
        scale: startScale
    });
};

export const wheelHandler = (event) => {
    event.preventDefault();

    const { deltaX, deltaY } = event;
    const isZoom = deltaX === 0 && !Number.isInteger(deltaY)
    const actionFunction = isZoom ? zoom : move;
    actionFunction(event);
};

export const resetPicture = () => {
    updateMainPicture({
        pixelX: 0,
        pixelY: 0,
        scale: 1
    });
};
