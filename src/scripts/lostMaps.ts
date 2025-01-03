import logger from './logger.js';
import { LostMap } from './models/LostMap.js';
import { LostMaps } from './models/LostMapCollection.js';
import listing from './lostMaps/listing.js';
import { LostMapSheet } from './lostMaps/sheet.js';

declare global {
    interface Game {
        lostMaps: LostMaps
    }

    interface CONFIG {
        LostMap: {
            documentClass: typeof LostMap;
            sheetClass: typeof LostMapSheet;
            collection: typeof LostMaps;
        }
    }
}

class LostMapsHelper {
    init() {
        this.initModel();
        this.initSidebar();
    }

    initModel() {
        CONFIG.LostMap = {
            documentClass: LostMap,
            sheetClass: LostMapSheet,
            collection: LostMaps,
        };
        const loadedMaps: LostMap[] = []
        // @ts-ignore
        game.data.lostMaps = loadedMaps;
        const lostMapsCollection = new LostMaps(loadedMaps);
        game.lostMaps = lostMapsCollection;
        game.collections!.set('LostMap', lostMapsCollection);
    }

    initSidebar() {
        Hooks.on('renderSidebarTab', (app: SidebarTab, html: JQuery) => {
            logger.log('rendering sidebar tab', app.tabName);
            // TODO check if current user is GM

            if (app.tabName === 'tables') {
                logger.log('Founnd app with option tables');

                this._addRolltableButton(app, html);
            }
        });
    }

    _addRolltableButton(app: SidebarTab, html: JQuery) {
        const button = document.createElement('button');
        button.innerHTML = 'Manage Lost Maps';
        button.className = 'open-lost-maps';
        button.addEventListener('click', () => {
            console.log('button clicked');
            listing.open();
        });

        const headerActions = html.find('.directory-header .header-actions');
        headerActions.append(button);
    }
}

export default new LostMapsHelper();