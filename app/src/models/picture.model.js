const DatabaseSingleton = require("../utils/database");

const database = DatabaseSingleton.getInstance();

const insertPictures = async (pictures) => {
    const sql = "INSERT INTO pictures (name, path, type, rank) VALUES (?, ?, ?, ?);";
    const values = pictures;

    return database.batchRun(sql, values);
};

const getPicturesByType = async (type) => {
    const sql = type
        ? "SELECT * FROM pictures WHERE type = ?;"
        : "SELECT * FROM pictures;";
    const values = type ? [type] : [];

    return database.getAll(sql, values);
};

const getHighestRankPicturesByType = async (type) => {
    const sql = type
        ? "SELECT * FROM pictures WHERE rank = (SELECT MAX(rank) FROM pictures) AND type = ?;"
        : "SELECT * FROM pictures WHERE rank = (SELECT MAX(rank) FROM pictures);";
    const values = type ? [type] : [];

    return database.getAll(sql, values);
};

const updatePicture = async (id, newRank) => {
    const sql = "UPDATE pictures SET rank = ? WHERE id = ?;";
    const values = [newRank, id];

    return database.run(sql, values);
};

module.exports = {
    insertPictures,
    getPicturesByType,
    getHighestRankPicturesByType,
    updatePicture
};
