import { LostMap } from './LostMap.js';

export class LostMapCollection extends WorldCollection<typeof LostMap, 'LostMap'> {
    static override get documentClass(): typeof LostMap {
        return LostMap;
    }
}