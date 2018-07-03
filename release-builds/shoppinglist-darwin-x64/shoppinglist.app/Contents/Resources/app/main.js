const electron = require('electron');
const url = require('url');
const path = require('path');
//override electron = {app : '', BrowserWindow : ''}
const {app, BrowserWindow, Menu, ipcMain} = electron;
// set env
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;
app.on('ready', function(){
	//create new window
	mainWindow = new BrowserWindow({});
	//load html file 
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	// // build menu from termplate
	// const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// //insert menu
	// Menu.setApplicationMenu(mainMenu);
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
	mainWindow.on('close', function(){
		app.quit();
	})
});

// handle create add window 
function createAddWindow() {
	// create new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title:'Add Shopping List Item'
	});
	//load html to window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	//garage collection
	addWindow.on('close', function(){
		addWindow = null;
	})

}
// catch item:add
ipcMain.on('item:add', function(e, item) {
	
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
})
const mainMenuTemplate = [
	{},
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Item',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Clear Items',
				click(){
					mainWindow.webContents.send('item:clear');
				}
			},
			{
				role: 'Quit'
			}
			// {
			// 	label :'Quit',
			// 	accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
			// 	click(){
			// 		app.quit();
			// 	}
			// }
		]
		
      
	}
	
    
];
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}
// Add develper item if not in prod 
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Control+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}

		]
	})
}
//create menu template
// const mainMenuTemplate = [
// 	{
// 		label:'File'
// 	}
// ];
