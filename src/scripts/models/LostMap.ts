declare global {
	interface DocumentClassConfig {
		LostMap: typeof LostMap;
	}

    interface CONFIG {
        LostMap: typeof LostMap;
    }
}

export class LostMap extends ClientDocumentMixin(foundry.documents.BaseRollTable) {
	// Define the schema properly as an object with string keys
	static override defineSchema(): LostMapSchema {
		return {
			...foundry.documents.BaseRollTable.defineSchema(),
			mapImage: new foundry.data.fields.StringField({ required: true }),
			divisions: new foundry.data.fields.NumberField({
				required: true,
				default: 1,
				validate: (n: number) => n >= 1 && n <= 6,
			}),
			rollTableAdjustments: new foundry.data.fields.ArrayField(
				new foundry.data.fields.NumberField({ required: false })
			),
		};
	}
  
	// Additional logic can be added here
	get defaultRollAdjustments(): number[] {
		return [];
	  	// return Array(this.divisions).fill(20 / this.divisions);
	}

	static lostMap: typeof LostMap;
}
  
// Schema interface to aid with type inference (optional but useful)
export interface LostMapSchema extends foundry.documents.BaseRollTable.Schema {
	mapImage: foundry.data.fields.StringField<{ required: boolean }>;
	divisions: foundry.data.fields.NumberField<{ required: boolean }>;
	rollTableAdjustments: foundry.data.fields.ArrayField<foundry.data.fields.NumberField<{ required: boolean }>>;
}