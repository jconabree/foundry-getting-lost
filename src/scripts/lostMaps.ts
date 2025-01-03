import logger from './logger.js';
import { LostMap } from './models/LostMap.js';
import { LostMapCollection } from './models/LostMapCollection.js';
import listing from './lostMaps/listing.js';
import { LostMapSheet } from './lostMaps/sheet.js';

declare global {
    interface Game {
        lostMaps: LostMapCollection
    }

    interface CONFIG {
        LostMap: {
            documentClass: typeof LostMap;
            sheetClass: typeof LostMapSheet;
            collection: typeof LostMapCollection;
        }
    }
}

class LostMaps {
    init() {
        this.initModel();
        this.initSidebar();
    }

    initModel() {
        CONFIG.LostMap = {
            documentClass: LostMap,
            sheetClass: LostMapSheet,
            collection: LostMapCollection,
        };
        const loadedMaps: LostMap[] = []
        // @ts-ignore
        game.data.lostMaps = loadedMaps;
        const lostMapsCollection = new LostMapCollection(loadedMaps);
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
            listing.open();
        });

        // Find the footer in the sidebar and append the button
        const headerActions = html.find('.directory-header .header-actions');
        headerActions.append(button);
    }
}

export default new LostMaps();