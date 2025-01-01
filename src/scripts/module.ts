import settings from './settings.js';
import logger from './logger.js';

CONFIG.debug.hooks = true;

Hooks.once('init', async function() {
    settings.init();
});

Hooks.once('ready', async function() {
    // Do stuff
});

Hooks.on('renderSidebarTab', (app: SidebarTab, html: JQuery) => {
    logger.log('rendering sidebar tab', app.tabName);
    // Check if the current tab is the Rollable Tables sidebar
    if (app.tabName === 'tables') {
        logger.log('Founnd app with option tables');
        // Create a new button element
        const button = document.createElement('button');
        button.innerHTML = 'My Custom Buttdon';
        button.className = 'my-custom-button';
        button.style.margin = '5px'; // Optional: Add some styling
        button.addEventListener('click', () => {
            ui.notifications!.info('Custom button clicked!');
            // Add your custom functionality here
        });

        // Find the footer in the sidebar and append the button
        const headerActions = html.find('.directory-header .header-actions');
        headerActions.append(button);
    }
});