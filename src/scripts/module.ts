import settings from './settings.js';
import lostMaps from './lostMaps.js';

CONFIG.debug.hooks = true;

Hooks.once('init', function () {
    settings.init();
    lostMaps.init();
});
