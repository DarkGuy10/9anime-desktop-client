const { app, BrowserWindow, Menu, Tray , session, shell} = require('electron');
const path = require('path');
const Store = require('./Scripts/Store.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let appData = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
        initialURL: 'https://www.9anime.at/'
    }
});

var mainWindow;
const createWindow = () => {
    // Create the main window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });
    mainWindow.maximize();
    mainWindow.loadURL(appData.get('initialURL'));
    mainWindow.setMenu(null);
    mainWindow.on('close', () => {
		let lastVisited = mainWindow.webContents.getURL();
		appData.set('initialURL', lastVisited);
    });

	mainWindow.on('closed', () => {
        mainWindow = null;
	});

    // Keep only one app window
    mainWindow.webContents.on('new-window', (event) => {
        event.preventDefault();
	});

	//Prevent from straying to non 9anime websites
	mainWindow.webContents.on('will-navigate', (event, url) => {
		if (!url.includes('9anime')) {
			event.preventDefault();
			shell.openExternal(url)
		}
	});
};

var aboutWindow;
const createAboutModal = () => {
	//Create the About modal window
	aboutWindow = new BrowserWindow({ 
		parent: mainWindow, 
		modal: true, 
		width: 600,
		height: 400,
		frame: false,
		resizable: false,
		centre: true,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		} 
	})
	aboutWindow.loadFile(path.join(__dirname, 'RemoteProcesses/About/About.html'));
	aboutWindow.on('closed', () => {
        aboutWindow = null;
	});

	aboutWindow.webContents.on('will-navigate', (event, url) => {
			event.preventDefault();
			shell.openExternal(url);
	});
}


app.on('window-all-closed', () => {
	//Prevent the app from quitting when all windows are closed
});
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


// Adding the context menu
const contextMenu = require('electron-context-menu');
contextMenu({
	append: (defaultActions, params, browserWindow) => [
		{
			label: 'Reload Page',
			click: () => {
				mainWindow.webContents.reload();
			}
		},
		{
			label: 'Go back',
			click: () => {
				mainWindow.webContents.goBack();
			}
		},
		{
			label: 'Go forward',
			click: () => {
				mainWindow.webContents.goForward();
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			click: () => {
				app.quit();
			}
		}
	],
	showSaveImage: true,
	showSaveImageAs: true,
//	showInspectElement: false,
	showSearchWithGoogle: false,
	showLookUpSelection: false
});


// Adding the tray icon
var trayIcon;

const addTrayIcon = () => {
	const iconPath = path.join(__dirname, 'Icons/Icon-small.png');
	trayIcon = new Tray(iconPath);
	const trayMenu = Menu.buildFromTemplate([
	{
		label: '9anime Desktop',
		enabled: false,
		icon: path.join(__dirname, 'Icons/Icon-small.png')
	},
	{
		type: 'separator'
	},
	{
		label: 'Open 9anime',
		click: () => {
			if (!mainWindow) 
				createWindow();
		}
	},
	{
		label: 'About',
		click: () => {
			if(!aboutWindow)
				createAboutModal();
		}
	},
	{
		type: 'separator'
	},
	{
		label: 'Quit',
		click: () => {
			app.quit();
		}
	}
	]);
	trayIcon.setContextMenu(trayMenu);
};



// When the app starts...
app.on('ready', () => {
	createWindow();
	addTrayIcon();
	session.defaultSession.loadExtension(path.join(__dirname, 'Extensions'));
});