import logger from './logger.js';
import { LostMap } from './models/LostMap.js';
import LostMapSheet from './sheets/LostMap.js';

class LostMapsHelper {
    init() {
        this.initModel();
        this.initSidebar();
    }

    initModel() {
        Object.assign(CONFIG.JournalEntryPage.dataModels, {
            'foundry-getting-lost.lostMap': LostMap
        });

        DocumentSheetConfig.registerSheet(JournalEntryPage, 'foundry-getting-lost', LostMapSheet, {
            label: 'Lost Map',
            types: ['foundry-getting-lost.lostMap'],
            makeDefault: false
        });
    }

    initSidebar() {
        Hooks.on('renderSidebarTab', (app: SidebarTab, html: JQuery) => {
            logger.log('rendering sidebar tab', app.tabName);
            // TODO check if current user is GM

            if (app.tabName === 'journals') {
                this._addRolltableButton(app, html);
            }
        });
    }

    _addRolltableButton(app: SidebarTab, html: JQuery) {
        const button = document.createElement('button');
        button.innerHTML = 'Create New Lost Map';
        button.className = 'create-lost-map';
        button.addEventListener('click', () => {
            console.log('button clicked');
        });

        const headerActions = html.find('.directory-header .header-actions');
        headerActions.append(button);
    }
}

export default new LostMapsHelper();