import * as Validators from 'vuelidate/lib/validators'

// function from the blogpost/article from Marina Mosti on VueMastery (https://www.vuemastery.com/blog/Validating-Schema-Driven-forms-with-Vuelidate/)
export const validationRules = (
	schema: {
		componentId: string,
		elementId: string,
		label: string,
		validations: any,
		variable: string
	}[]
) => {
	return Object.keys(schema).reduce((rules: any, elementName: string) => {
		const item = schema[parseInt(elementName)]
		if (!Object.prototype.hasOwnProperty.call(item, 'validations')) {
			return rules
		}
		const validations: any = {}
		for (const rule in item.validations) {
			const params = item.validations[rule].params

			if (params) {
				validations[rule] = Validators[rule](params)
			} else {
				validations[rule] = Validators[rule]
			}
		}
		rules[elementName] = validations
		return rules
	}, {})
}
