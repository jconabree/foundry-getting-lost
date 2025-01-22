declare global {
	interface DocumentClassConfig {
		LostMap: typeof LostMap;
	}
}

export class LostMap<Schema extends LostMapSchema = LostMapSchema> extends foundry.abstract.TypeDataModel<Schema, foundry.documents.BaseJournalEntry> {
	static MAX_DIVISIONS = 5;
	static MIN_DIVISIONS = 1;

	static override defineSchema(): LostMapSchema {
		return {
			name: new foundry.data.fields.StringField({ required: true }),
			mapImage: new foundry.data.fields.FilePathField({
				required: true,
				categories: ['IMAGE']
			}),
			text: new foundry.data.fields.SchemaField({
				content: new foundry.data.fields.HTMLField({
					required: false,
					initial: '',
					textSearch: true
				}),
				markdown: new foundry.data.fields.StringField({
					required: false,
					initial: undefined
				}),
				format: new foundry.data.fields.NumberField({
					required: false,
					label: "JOURNALENTRYPAGE.Format",
					initial: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML,
					choices: Object.values(CONST.JOURNAL_ENTRY_PAGE_FORMATS)
				})
			}),
			divisions: new foundry.data.fields.NumberField({
				required: true,
				default: 3,
				validate: (n: number) => n >= LostMap.MIN_DIVISIONS && n <= LostMap.MAX_DIVISIONS,
			}),
			rollTableAdjustments: new foundry.data.fields.JSONField({
				required: true,
				initial: JSON.stringify({
					type: 'even'
				})
			}),
		};
	}
  
	// Additional logic can be added here
	get defaultRollAdjustments(): LostMapRollTableAdjustment {
		return {
			type: 'even'
		};
	}
}


export type LostMapSpreadEven = 'even';
export type LostMapSpreadCustom = 'custom';
type LostMapQuadrantSpread = {
	1: number;
	2: number;
	3: number;
	4: number;
};

export interface LostMapRollTableAdjustment {
	type: LostMapSpreadEven|LostMapSpreadCustom;
	adjustments?: null|LostMapQuadrantSpread[]
}
  
// Schema interface to aid with type inference (optional but useful)
export interface LostMapSchema extends foundry.data.fields.DataSchema {
	name: foundry.data.fields.StringField<{ required: boolean }>;
	mapImage: foundry.data.fields.FilePathField<{ required: boolean; categories: ['IMAGE'] }>;
	text: foundry.data.fields.SchemaField<{
		content: foundry.data.fields.HTMLField<{ required: false; }>;
		markdown: foundry.data.fields.StringField<{ required: false }>;
		format: foundry.data.fields.NumberField<{ required: false }>;
	}>;
	divisions: foundry.data.fields.NumberField<{ required: boolean }>;
	rollTableAdjustments: foundry.data.fields.JSONField<{ initial: string; required: boolean }>;
}