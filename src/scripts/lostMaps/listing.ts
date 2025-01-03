// TODO handle opening dialog, listing, CRUD + interface, etc
import { LostMap } from "../models/LostMap.js";
import { LostMaps } from "../models/LostMapCollection.js";
import logger from "../logger.js";
import { AnyObject, DeepPartial } from "@league-of-foundry-developers/fvtt-types/utils";

interface ListingApplicationConfiguration extends foundry.applications.api.ApplicationV2.Configuration {

}

interface ListingApplicationRenderOptions extends foundry.applications.api.ApplicationV2.RenderOptions {

}

interface ListingContext extends AnyObject {
    items: LostMaps
}

class ListingApplication extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.api.ApplicationV2<ListingContext, ListingApplicationConfiguration, ListingApplicationRenderOptions>
) {
    static DEFAULT_OPTIONS = {
        id: 'lost-maps-list',
        form: {
            handler: ListingApplication.#search,
            closeOnSubmit: false,
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
          template: "./modules/foundry-getting-lost/dist/templates/list-header.hbs"
        },
        list: {
          template: "./modules/foundry-getting-lost/dist/templates/list.hbs",
          scrollable: [''],
        }
    }

    get title() {
        return game.i18n!.localize(this.options.window.title);
    }

    static #search() {
        console.log('stuff');
    }

    async _prepareContext(
        options: DeepPartial<ListingApplicationRenderOptions> & { isFirstRender: boolean; }
    ): Promise<ListingContext> {
        const context = await super._prepareContext(options);
        return {
            ...context,
            items: (await game.collections!.get('LostMap')) as LostMaps
        };
    }

    _onRender(context: ListingContext, options: ListingApplicationRenderOptions) {
        this.element.querySelectorAll<HTMLButtonElement>('.create-new-lost-map').forEach((button) => {
            button.onclick = () => LostMap.createDialog()
        })
    }
}

class Listing {
    open() {
        console.log('open app');
        new ListingApplication({}).render({ force: true });
    }
}

export default new Listing();