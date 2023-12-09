const sqlite3 = require('sqlite3').verbose();

const DATABASE = "picturePicker.db";

class Database {
    #database;

    constructor() {}

    async connect() {
        return new Promise((resolve, reject) => {
            this.#database = new sqlite3.Database(DATABASE, (err) => {
                if (err) return reject(err);

                console.log("[database] connected");
                resolve();
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            this.#database.close((err) => {
                if (err) return reject(err);

                console.log("[database] closed");
                resolve();
            });
        });
    }

    async initialize() {
        const sql = `
            CREATE TABLE IF NOT EXISTS pictures (
                id INTEGER PRIMARY KEY,
                name TEXT,
                path TEXT,
                type TEXT,
                rank INTEGER
            )
            ;`;

        return new Promise((resolve, reject) => {
            this.#database.run(sql, (err) => {
                if (err) return reject(err);
                
                console.log("[database] table created");
                resolve();
            });
        });
    }

    async insertPictures(pictures) {
        return new Promise((resolve, reject) => {
            this.#database.serialize(() => {
                this.#database.run("BEGIN TRANSACTION;");
    
                const stmt = this.#database.prepare("INSERT INTO pictures (name, path, type, rank) VALUES (?, ?, ?, ?);");
                pictures.forEach((picture) => stmt.run(...picture));
            
                this.#database.run("COMMIT;", (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("[database] insert completed")
                        resolve();
                    }
                });
            
                stmt.finalize();
            });
        });
    }
    
    async updatePicture(id, newRank) {
        return new Promise((resolve, reject) => {
            this.#database.run(
                `
                UPDATE pictures
                SET rank = ?
                WHERE id = ?;
                `,
                [newRank, id],
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
    
    async fetchPictures(type) {
        const sql = type
            ? "SELECT * FROM pictures WHERE type = ?;"
            : "SELECT * FROM pictures;";
        const values = type ? [type] : [];
    
        return new Promise((resolve, reject) => {
            this.#database.all(sql, values, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("[database] fetch completed")
                    resolve(rows);
                }
            });
        });
    }
    
    async fetchHighestRankPictures(type) {
        const sql = type
            ? "SELECT * FROM pictures WHERE rank = (SELECT MAX(rank) FROM pictures) AND type = ?;"
            : "SELECT * FROM pictures WHERE rank = (SELECT MAX(rank) FROM pictures);";
        const values = type ? [type] : [];
    
        return new Promise((resolve, reject) => {
            this.#database.all(sql, values, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("[database] fetch completed")
                    resolve(rows);
                }
            });
        });
    }
}

class DatabaseSingleton {
    static #instance;

    constructor() {
        console.error("should use getInstance()!");
    }

    static getInstance() {
        if (!this.#instance) this.#instance = new Database();
        return this.#instance;
    }
}

module.exports = DatabaseSingleton;
