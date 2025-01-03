import { LostMap } from "../models/LostMap.js";
import logger from "../logger.js";
import { AnyObject, DeepPartial } from "@league-of-foundry-developers/fvtt-types/utils";

interface LostMapSheetContext extends AnyObject {
}

interface LostMapSheetConfiguration extends foundry.applications.api.DocumentSheetV2.Configuration<LostMap> {
    
}

interface LostMapSheetRenderOptions extends foundry.applications.api.DocumentSheetV2.RenderOptions {

}

// interface LostMapSheetConfiguration

export class LostMapSheet extends foundry.applications.api.DocumentSheetV2<LostMap, LostMapSheetContext, LostMapSheetConfiguration, LostMapSheetRenderOptions> {
    static DEFAULT_OPTIONS = {
        id: 'lost-map-sheet',
        form: {
            handler: LostMapSheet.#onSubmit,
            closeOnSubmit: true,
        },
        position: {
            width: 640,
            height: 'auto' as 'auto',
        },
        window: {
            icon: "fas fa-list",
            title: "foundry-getting-lost.list.title"
        }
    }

    static PARTS = {
        header: {
            template: "./modules/foundry-getting-lost/dist/templates/sheet-header.hbs"
        },
        general: {
            template: "./modules/foundry-getting-lost/dist/templates/sheet-general.hbs"
        },
        weights: {
            template: "./modules/foundry-getting-lost/dist/templates/sheet-weights.hbs"
        },

    }

    get title() {
        return game.i18n!.localize(this.options.window.title);
    }

    static #onSubmit(...data: unknown[]) {
        logger.log('save', data);
    }

    async _prepareContext(
        options: DeepPartial<LostMapSheetRenderOptions> & { isFirstRender: boolean; }
    ): Promise<LostMapSheetContext> {
        const context = await super._prepareContext(options);

        if (!this.tabGroups.primary) this.tabGroups.primary = 'general';

        return {
            ...context,
            tabs: this._getTabs(options.parts),
            lostMap: this.document
        }
    }

    _getTabs(parts?: string[]) {
        const tabGroup = 'primary';
      
        // Default tab for first time it's rendered this session
        if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = 'general';
      
        return parts?.reduce((tabs, partId) => {
            const tab = {
                cssClass: '',
                group: tabGroup,
                id: '',
                icon: '',
                label: 'foundry-getting-lost.tab.',
            };
        
            switch (partId) {
                case 'header':
                case 'tabs':
                    return tabs;
                case 'general':
                    tab.id = 'general';
                    tab.label += 'general';
                    break;
                case 'weights':
                    tab.id = 'weights';
                    tab.label += 'weights';
                    break;
                default:
            }
        
            // This is what turns on a single tab
            if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
        
            tabs[partId] = tab;

            return tabs;
        }, {} as {
            [key: string]: {
                cssClass: string;
                group: string;
                id: string;
                icon: string;
                label: string;
            }
        });
    }

    _onRender(context: LostMapSheetContext) {
        // TODO bind controls
    }
}