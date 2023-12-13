const defaultPicture = "../../../../resources/images/empty.jpg";

export let currentPictureIndex = 0;
export let currentPictureRank = 0;
export let currentPictureMin = 0;
export let currentPictureMax = 0;

export async function reloadPictures(index, rank) {
    const { pictures, currentIndex, currentRank, picturesRankCount } = await window.electron.reloadPictures(index, rank);

    currentPictureIndex = currentIndex;
    currentPictureRank = currentRank;
    currentPictureMax = picturesRankCount[currentRank];

    document.getElementById("current-ranking").value = currentPictureRank;

    document.getElementById("preview-picture-1").setAttribute("src", pictures[0].path || defaultPicture);
    document.getElementById("preview-picture-2").setAttribute("src", pictures[1].path || defaultPicture);
    document.getElementById("preview-picture-3").setAttribute("src", pictures[2].path || defaultPicture);
    document.getElementById("preview-picture-4").setAttribute("src", pictures[3].path || defaultPicture);
    document.getElementById("preview-picture-5").setAttribute("src", pictures[4].path || defaultPicture);
    document.getElementById("main-picture").setAttribute("src", pictures[2].path || defaultPicture);

    const picturesRankArray = Object.entries(picturesRankCount).sort(([a], [b]) => +b - +a);
    let rankingMapString = "";
    for (const [key, value] of picturesRankArray) {
        rankingMapString += `Rank ${key}: ${value} picture(s).\n`;
    }
    document.getElementById("pictures-ranking-map").textContent = rankingMapString;
}
