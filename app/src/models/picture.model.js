const DatabaseSingleton = require("../utils/database");

const database = DatabaseSingleton.getInstance();

// async insertPictures(pictures) {
//     return new Promise((resolve, reject) => {
//         this.#database.serialize(() => {
//             this.#database.run("BEGIN TRANSACTION;");

//             const stmt = this.#database.prepare("INSERT INTO pictures (name, path, type, rank) VALUES (?, ?, ?, ?);");
//             pictures.forEach((picture) => stmt.run(...picture));
        
//             this.#database.run("COMMIT;", (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     console.log("[database] insert completed")
//                     resolve();
//                 }
//             });
        
//             stmt.finalize();
//         });
//     });
// }

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
    getPicturesByType,
    getHighestRankPicturesByType,
    updatePicture
};
