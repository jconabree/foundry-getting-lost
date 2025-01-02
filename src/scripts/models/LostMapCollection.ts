import { LostMap } from './LostMap.js';

declare global {
	interface DocumentClassConfig {
		LostMap: typeof LostMap;
	}

    interface CONFIG {
        LostMap: typeof LostMap;
    }

    namespace foundry {
        namespace utils {
            interface Collection {
                LostMap: typeof LostMapCollection;
            }
        }
    }
}


export class LostMapCollection extends WorldCollection<typeof LostMap, 'LostMap'> {
    static override get documentClass(): typeof LostMap {
        return LostMap;
    }
}