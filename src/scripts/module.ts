import settings from './settings';
import logger from './logger';

if (process.env.DEBUG) {
    CONFIG.debug.hooks = true;
    logger.warn('Setting debug hooks to true');
}

Hooks.once('init', async function() {
    settings.init();
});

Hooks.once('ready', async function() {
    // Do stuff
});
