import { GetDataReturnType, MaybePromise } from '@league-of-foundry-developers/fvtt-types/utils';
import logger from '../logger.js';
import ModuleTemplate from '../template.js';
import { LostMap } from '../models/LostMap.js';

type JournalLostMapPageSheetContext = MaybePromise<GetDataReturnType<JournalPageSheet.JournalPageSheetData>> & {
	document: LostMap
}

export default class JournalLostMapPageSheet extends JournalTextPageSheet {
    static get defaultOptions() {
        const options = foundry.utils.mergeObject(super.defaultOptions, {
          submitOnChange: true,
          width: 700,
		  rollTableAdjustments: {}
        });
        options.classes.push('lost-map', 'text dnd5e2-journal');

        return options;
    }

    get template() {
      	return ModuleTemplate._getPath(`journal/lost-map-${this.isEditable ? "edit" : "view"}.hbs`);
    }

	static get format() {
		return CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
	}

    async getData(options: JournalLostMapPageSheetOptions) {
		const context = await super.getData(options) as JournalLostMapPageSheetContext;
		// @ts-ignore
		context.system = context.document.system;
		//   context.embedRendering = this.options.embedRendering ?? false;
		//   context.title = context.data.title.value;//Object.fromEntries(Array.fromRange(4, 1).map(n => [`level${n}`, context.data.title.level + n - 1]));
	
		// @ts-ignore
		context.editor = {
			engine: "prosemirror",
			collaborate: true,
			// @ts-ignore
			content: await TextEditor.enrichHTML(context.system.text.content, {
				relativeTo: this.object,
				secrets: this.object.isOwner,
				// @ts-ignore
				async: true
			})
		}

		// @ts-ignore
		context.AVAILABLE_DIVISIONS = Object.fromEntries(
			Array.from({ length: 6 }).map((_, index) => [index, index])
		);

		// context.flavorText = await TextEditor.enrichHTML(
		// 	// @ts-ignore
		// 	context.document.flavorText.value,
		// 	{
		// 		// @ts-ignore
		// 		async: true,
		// 		secrets: this.object.isOwner,
		// 		relativeTo: this.object
		// 	}
		// );
		// @ts-ignore
		// if ( context. === "<p></p>" ) context.flavorText = "";      
  
      return context;
    }

    /** @inheritDoc */
    activateListeners(jQuery: JQuery) {
      super.activateListeners(jQuery);
      const [html] = jQuery;
  
    //   html.querySelector('[name="grouping"]')?.addEventListener("change", event => {
    //     this.grouping = (event.target.value === this.document.system.grouping) ? null : event.target.value;
    //     this.object.parent.sheet.render();
    //   });
      html.querySelectorAll<HTMLButtonElement>("[data-action]").forEach(e => {
        e.addEventListener('click', this._onAction.bind(this));
      });
    }
  
    /* -------------------------------------------- */
  
    /**
     * Handle performing an action.
     * @param {PointerEvent} event  This triggering click event.
     */
    async _onAction(event: MouseEvent) {
        logger.log('Action Event', event);
    //   event.preventDefault();
    //   const { action } = event.target.dataset;
    }
}

interface JournalLostMapPageSheetOptions extends JournalPageSheet.Options {

}