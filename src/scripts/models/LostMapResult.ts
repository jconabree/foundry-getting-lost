import { LostMap, LostMapSchema } from './LostMap.js';

declare global {
	interface DocumentClassConfig {
		LostMapResult: typeof LostMapResult;
	}
}

export class LostMapResult extends LostMap<LostMapResultSchema> {
	static override defineSchema(): LostMapResultSchema {
		return {
			...super.defineSchema(),
			rollResult: new foundry.data.fields.ArrayField(
				new foundry.data.fields.NumberField({
					min: 1,
					max: 20
				}),
				{
					required: true
				}
			)
		};
	}
}
  
// Schema interface to aid with type inference (optional but useful)
export interface LostMapResultSchema extends LostMapSchema {
	rollResult: foundry.data.fields.ArrayField<
		foundry.data.fields.NumberField<{ min: number; max: number }>,
		{
			required: true
		}
	>;
}