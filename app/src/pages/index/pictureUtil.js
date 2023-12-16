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

    $("#current-rank").val(currentPictureRank);

    $("#preview-picture-1").attr("src", pictures[0].path || defaultPicture);
    $("#preview-picture-2").attr("src", pictures[1].path || defaultPicture);
    $("#preview-picture-3").attr("src", pictures[2].path || defaultPicture);
    $("#preview-picture-4").attr("src", pictures[3].path || defaultPicture);
    $("#preview-picture-5").attr("src", pictures[4].path || defaultPicture);
    $("#main-picture").attr("src", pictures[2].path || defaultPicture);

    const picturesRankArray = Object.entries(picturesRankCount).sort(([a], [b]) => +b - +a);
    let rankingMapString = "";
    for (const [key, value] of picturesRankArray) {
        rankingMapString += `Rank ${key}: ${value} picture(s).\n`;
    }
    $("#pictures-rank-status").text(rankingMapString);
}
