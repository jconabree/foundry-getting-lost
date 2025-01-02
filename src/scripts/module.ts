import settings from './settings.js';
import logger from './logger.js';
import lostMaps from './lostMaps.js';

CONFIG.debug.hooks = true;

console.log('test');
Hooks.once('init', async function() {
    settings.init();
    lostMaps.init();
});