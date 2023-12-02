const sqlite3 = require('sqlite3').verbose();

const DATABASE = "picturePicker.db";

let db = null;

async function connectDB() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DATABASE, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("[database] connected");
                resolve(db);
            }
        });
    });
}

async function createTable() {
    return new Promise((resolve, reject) => {
        db.run(
            `
            CREATE TABLE IF NOT EXISTS pictures (
                id INTEGER PRIMARY KEY,
                name TEXT,
                path TEXT,
                rank INTEGER
            );
            `,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("[database] table created");
                    resolve();
                }
            }
        );
    });
}

async function initDB() {
    await connectDB();
    await createTable();
}

async function closeDB() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
            } else {
                console.log("[database] closed");
                resolve();
            }
        });
    });
}

async function insertPictures(pictures) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION;");

            const stmt = db.prepare("INSERT INTO pictures (name, path, rank) VALUES (?, ?, ?);");
            pictures.forEach((picture) => stmt.run(...picture));
        
            db.run("COMMIT;", (err) => {
                if (err) {
                    reject(err);
                }
            });
        
            stmt.finalize();
            console.log("[database] insert completed")
            resolve();
        });
    });
}

async function updatePicture(picture) {
    return new Promise((resolve, reject) => {
        db.run(
            `
            UPDATE pictures
            SET rank = ?
            WHERE id = ?;
            `,
            [picture],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("[database] update completed")
                    resolve();
                }
            }
        );
    });
}

async function fetchPictures() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM pictures;`,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("[database] fetch completed")
                    resolve(rows);
                }
            }
        );
    });
}

module.exports = {
    initDB,
    closeDB,
    insertPictures,
    updatePicture,
    fetchPictures
};
