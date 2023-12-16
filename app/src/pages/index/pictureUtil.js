const DEFAULT_PICTURE = "../../../../resources/images/empty.jpg";

const picturesCache = {};

export let currentPictureIndex = 0;
export let currentPictureRank = 0;
export let currentPictureMin = 0;
export let currentPictureMax = 0;

export const savePictures = async () => {
    await window.electron.savePictures();
    await loadPictures();
};

export const loadPictures = async () => {
    const pictures = await window.electron.loadPictures();
    for (const picture of pictures) {
        if (picturesCache[picture.rank]) {
            picturesCache[picture.rank].push(picture);
        } else {
            picturesCache[picture.rank] = [picture];
        }
    }
    await reloadPictures();
};

export async function reloadPictures(index = 0, rank = 0) {
    const pictures = [];
    for (let i = index - 2; i < index + 3; i++) {
        const picture = picturesCache?.[rank]?.[i] || {};
        pictures.push(picture);
    }

    const picturesRankCount = Object.entries(picturesCache)
        .reduce((acc, [key, values]) => {
            acc[key] = values.length
            return acc;
        }, {});

    currentPictureIndex = index;
    currentPictureRank = rank;
    currentPictureMax = picturesRankCount[rank];

    $("#current-rank").val(currentPictureRank);

    $("#preview-picture-1").attr("src", pictures[0].path || DEFAULT_PICTURE);
    $("#preview-picture-2").attr("src", pictures[1].path || DEFAULT_PICTURE);
    $("#preview-picture-3").attr("src", pictures[2].path || DEFAULT_PICTURE);
    $("#preview-picture-4").attr("src", pictures[3].path || DEFAULT_PICTURE);
    $("#preview-picture-5").attr("src", pictures[4].path || DEFAULT_PICTURE);
    $("#main-picture").attr("src", pictures[2].path || DEFAULT_PICTURE);

    const picturesRankArray = Object.entries(picturesRankCount).sort(([a], [b]) => +b - +a);
    let rankingMapString = "";
    for (const [key, value] of picturesRankArray) {
        rankingMapString += `Rank ${key}: ${value} picture(s).\n`;
    }
    $("#pictures-rank-status").text(rankingMapString);
}

export const updatePictureRank = async (score) => {
    const picture = picturesCache[currentPictureRank].splice(currentPictureIndex, 1)[0];
    const newRank = +currentPictureRank + score;

    // update database
    await window.electron.updatePictureRank(picture.id, newRank);

    // update memory map
    if (picturesCache[newRank]) {
        picturesCache[newRank].push(picture);
    } else {
        picturesCache[newRank] = [picture];
    }
};

export const exportHighestRankPictures = () => {
    window.electron.exportHighestRankPictures();
};
