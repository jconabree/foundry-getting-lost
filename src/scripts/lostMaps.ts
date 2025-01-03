import logger from './logger.js';
import { LostMap } from './models/LostMap.js';
import { LostMapCollection } from './models/LostMapCollection.js';
import listing from './lostMaps/listing.js';

class LostMaps {
    init() {
        this.initModel();
        this.initSidebar();
    }

    initModel() {
        LostMap.addDocumentToConfig();
        LostMapCollection.addCollectionToGame(game as InitGame);
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