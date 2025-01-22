import { GetDataReturnType, MaybePromise } from '@league-of-foundry-developers/fvtt-types/utils';
import logger from '../logger.js';
import ModuleTemplate from '../template.js';
import { LostMap } from '../models/LostMap.js';
import { LostMapResult } from '../models/LostMapResult.js';

type LostMapDivisionLine = {
	percent: number;
	color: string;
};

type JournalLostMapResultPageSheetContext = MaybePromise<GetDataReturnType<JournalTextPageSheet.TextData>> & {
	document: LostMapResult & {
		text: {
			content: string;
		}
		system: LostMapResult
	};
	system: LostMapResult;
	content: string;
	lines: LostMapDivisionLine[];
	linesClass: string;
	formattedRolls: string;
	percent: number;
	coordinates: {
		cardinalDirections: string[],
		top: number;
		left: number;
	}
}

export default class JournalLostMapResultPageSheet extends JournalTextPageSheet {
    static get defaultOptions() {
        const options = foundry.utils.mergeObject(super.defaultOptions, {
          submitOnChange: true,
          width: 700,
		  rollTableAdjustments: {}
        });
        options.classes.push('lost-map-result', 'text dnd5e2-journal');

        return options;
    }

	get isEditable(): boolean {
		return false;
	}

    get template() {
      	return ModuleTemplate._getPath(`journal/lost-map-result-view.hbs`);
    }

	static get format() {
		return CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
	}

    async getData(options: JournalLostMapPageSheetOptions) {
		const context = await super.getData(options) as JournalLostMapResultPageSheetContext;
		context.system = context.document.system;

		context.content = await TextEditor.enrichHTML(context.document.text.content!, {
			relativeTo: this.object,
			secrets: this.object.isOwner,
			// @ts-ignore
			async: true
		})

		this._addDivisionLines(context);
		context.linesClass = true ? 'shown' : '';

		const rolls = context.system.rollResult as number[]
		const coordinates = this._getCoordinatesFromRolls(rolls);

		context.formattedRolls = rolls.map((roll, index) => `${roll} (${coordinates.cardinalDirections[index]})`).join(', ');
		context.coordinates = coordinates;
		context.percent = 100 * 1/Math.pow(2, context.system.divisions as number);
  
      	return context;
    }

	_addDivisionLines(context: JournalLostMapResultPageSheetContext) {
		const divisions = context.system.divisions!;

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

	_getCoordinatesFromRolls(rolls: number[]) {
		const cardinalDirections: string[] = [];
		const [top, left] = rolls.reduce((combined, result, index) => {
			const position = 100 * 1/Math.pow(2, index + 1);
			const [currentTop, currentLeft] = combined;
			const isSouth = result >= 10;
			const isEast = result > 5 && result < 16;
			
			cardinalDirections.push(`${isSouth ? 'South' : 'North'}-${isEast ? 'East' : 'West'}`);
		
			return [
				currentTop + (isSouth ? position : 0),
				currentLeft + (isEast ? position : 0),
			];
		}, [0, 0]);

		return {
			cardinalDirections,
			top,
			left
		}
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
		const $button = $(event.target).closest('button');
		const action = $button.data('action');

		switch (action) {
			case 'toggle-divisions':
				$button.toggleClass('active');
				$button.closest('.journal-page-content').find('.fgl-lost-map-division').toggleClass('shown');

				break;
			default:
		}
    }
}

interface JournalLostMapPageSheetOptions extends JournalPageSheet.Options {

}