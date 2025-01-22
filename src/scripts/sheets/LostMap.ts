import { GetDataReturnType, MaybePromise } from '@league-of-foundry-developers/fvtt-types/utils';
import logger from '../logger.js';
import ModuleTemplate from '../template.js';
import { LostMap } from '../models/LostMap.js';
import { LostMapResult } from '../models/LostMapResult.js';

type LostMapDivisionLine = {
	percent: number;
	color: string;
};

type JournalLostMapPageSheetContext = MaybePromise<GetDataReturnType<JournalPageSheet.JournalPageSheetData>> & {
	document: LostMap & { system: LostMap };
	system: LostMap;
	AVAILABLE_DIVISIONS: {
		[key: string]: string;
	}
	lines?: LostMapDivisionLine[];
	runReady: boolean;
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
			content: await TextEditor.enrichHTML(context.document.text.content, {
				relativeTo: this.object,
				secrets: this.object.isOwner,
				// @ts-ignore
				async: true
			})
		}

		// @ts-ignore
		context.AVAILABLE_DIVISIONS = Object.fromEntries(
			Array.from({ length: LostMap.MAX_DIVISIONS }).map((_, index) => [
				(index + 1).toString(),
				`foundry-getting-lost.sheet.divisionOption${index + 1}`
			])
		);

		this._addDivisionLines(context); 

		context.runReady = this._isRunAvailable(context.system);
  
      	return context;
    }

	_addDivisionLines(context: JournalLostMapPageSheetContext) {
		const divisions = context.system.divisions;
		if (!divisions) {
			return;
		}

		const lineColors = [
			"#FF5733", // Vibrant Red-Orange
			"#33FF57", // Bright Green
			"#3357FF", // Strong Blue
			"#F7DC6F", // Warm Yellow
			"#AF7AC5", // Soft Purple
			"#48C9B0", // Cool Teal
		];

		const lines = Array.from({ length: divisions })
			.reduce((collectedLines: LostMapDivisionLine[], _, index) => {
				const numberOfLines = Math.pow(2, (index + 1))
				const basePercent = 100 / numberOfLines;
				const color = lineColors[index];

				for (let i = 1; i <= numberOfLines; i++) {
					if (i % 2 === 0) {
						continue;
					}

					collectedLines.push({
						color,
						percent: basePercent * i
					});
				}

				return collectedLines;
			}, []);

		context.lines = lines;
	}

	_isRunAvailable(lostMap: LostMap): boolean {
		return Boolean(
			lostMap.divisions &&
			lostMap.mapImage &&
			lostMap.rollTableAdjustments?.type
		);
	}

    /** @inheritDoc */
    activateListeners(jQuery: JQuery) {
      super.activateListeners(jQuery);
  
      jQuery.find<HTMLButtonElement>("[data-action]").on<'click'>('click', this._onAction.bind(this));
    }
  
    /* -------------------------------------------- */
  
    /**
     * Handle performing an action.
     * @param {PointerEvent} event  This triggering click event.
     */
    async _onAction(event: JQuery.ClickEvent) {
        logger.log('Action Event', event);

		event.preventDefault();
		const { action } = (event.target as HTMLButtonElement).dataset;

		switch (action) {
			case 'run-map':
				const lostMap = this.document.system as LostMap;

				if (!this._isRunAvailable(lostMap)) {
					logger.warn('Map run is unavailable for map', lostMap);

					return;
				}
				
				logger.log('Run the map', event);
				
				const roll = await new Roll(`${lostMap.divisions}d20`).roll();
				const [dice] = roll.dice;
				const results = dice.results.map(({result}: { result: number; }) => result);
				logger.log('Rolls: ', results);
				
				const journalEntry = this.object.parent as JournalEntry;
				const resultPageData = {
					type: 'foundry-getting-lost.lostMapResult',
					name: `${this.document.name} - Result`,
					// @ts-ignore
					system: {
						name: `${this.document.name} - Result`,
						mapImage: lostMap.mapImage,
						divisions: lostMap.divisions,
						rollTableAdjustments: lostMap.rollTableAdjustments,
						rollResult: results
					},
					sort: journalEntry.pages.entries.length + 1,
					text: this.document.text,
				};
				const [resultPage] = await journalEntry.createEmbeddedDocuments(
					'JournalEntryPage',
					// @ts-ignore
					[resultPageData]
				) as unknown as JournalEntryPage[];

				if (!resultPage) {
					logger.error('Could not create result page');

					return;
				}

				await Journal.show(resultPage);
				
				break;
			default:
		}
    }
}

interface JournalLostMapPageSheetOptions extends JournalPageSheet.Options {

}