import { LostMap } from './LostMap.js';

export class LostMaps extends WorldCollection<typeof LostMap, 'LostMap'> {
    static override get documentClass(): typeof LostMap {
        return LostMap;
    }
}