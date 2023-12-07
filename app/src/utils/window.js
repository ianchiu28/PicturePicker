const { BrowserWindow, Menu } = require("electron");
const path = require("node:path");

class Window {
    #mainWindow;

    constructor() {
        // Create the browser window.
        this.#mainWindow = new BrowserWindow({
            width: 1600,
            height: 900,
            webPreferences: {
                preload: path.join(__dirname, "..", "..", "electron", "preload.js")
            }
        });
    }

    initialize() {
        Menu.setApplicationMenu(null);

        // and load the index.html of the app.
        this.#mainWindow.loadFile("app/src/pages/index/index.html");

        // Open the DevTools.
        this.#mainWindow.webContents.openDevTools();
    }
}

class WindowSingleton {
    static #instance;

    constructor() {
        console.error("should use getInstance()!");
    }

    static getInstance() {
        if (!this.#instance) this.#instance = new Window();
        return this.#instance;
    }
}

module.exports = WindowSingleton;
