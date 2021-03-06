'use strict';
const electron = require('electron');
const ipc = require('electron').ipcMain
const app = electron.app;
//const robot = require('robotjs');
//const screenSize = robot.getScreenSize();
// const socket=io();
// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 1000,
		frame: false,
		transparent: true
	});

	win.maximize();
	//window.TIME for globally
	setTimeout(function(){
		win.setIgnoreMouseEvents(true);
	},30000)
	
	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});


// 
// Event handler for the gaze message (just like the socket version)
// 
ipc.on('gaze', (event, arg) => {
  console.log("[gaze received]");
  
});
