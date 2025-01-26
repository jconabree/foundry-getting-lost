import logger from './logger.js';
import { LostMap } from './models/LostMap.js';
import { LostMapResult } from './models/LostMapResult.js';
import LostMapSheet from './sheets/LostMap.js';
import LostMapResultSheet from './sheets/LostMapResult.js';

class LostMapsHelper {
    init() {
        this.initModel();
        this.initSidebar();
    }

    initModel() {
        Object.assign(CONFIG.JournalEntryPage.dataModels, {
            'foundry-getting-lost.lostMap': LostMap,
            'foundry-getting-lost.lostMapResult': LostMapResult
        });

        DocumentSheetConfig.registerSheet(JournalEntryPage, 'fgl-lost-map', LostMapSheet, {
            label: 'Lost Map',
            types: ['foundry-getting-lost.lostMap'],
            canConfigure: false,
            makeDefault: true
        });
        
        DocumentSheetConfig.registerSheet(JournalEntryPage, 'fgl-lost-map-result', LostMapResultSheet, {
            label: 'Lost Map Result',
            types: ['foundry-getting-lost.lostMapResult'],
            makeDefault: true,
            canConfigure: false,
        });
    }

    initSidebar() {
        Hooks.on('renderSidebarTab', (app: SidebarTab, html: JQuery) => {
            logger.log('rendering sidebar tab', app.tabName);
            // TODO check if current user is GM

            if (app.tabName === 'journals') {
                // this._addRolltableButton(app, html);
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