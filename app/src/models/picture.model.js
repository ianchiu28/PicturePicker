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

// async updatePicture(id, newRank) {
//     return new Promise((resolve, reject) => {
//         this.#database.run(
//             `
//             UPDATE pictures
//             SET rank = ?
//             WHERE id = ?;
//             `,
//             [newRank, id],
//             (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     console.log("[database] update completed")
//                     resolve();
//                 }
//             }
//         );
//     });
// }



// async fetchHighestRankPictures(type) {
//     const sql = type
//         ? "SELECT * FROM pictures WHERE rank = (SELECT MAX(rank) FROM pictures) AND type = ?;"
//         : "SELECT * FROM pictures WHERE rank = (SELECT MAX(rank) FROM pictures);";
//     const values = type ? [type] : [];

//     return new Promise((resolve, reject) => {
//         this.#database.all(sql, values, (err, rows) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 console.log("[database] fetch completed")
//                 resolve(rows);
//             }
//         });
//     });
// }

module.exports = {
    getPicturesByType
};
