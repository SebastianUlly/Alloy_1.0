<template>
	<div v-if="nestedArray">
		<div v-for="(element, key) of nestedArray" :key="element.elementId">
			<div>
				<component
					:is="element.componentId"
					v-if="!element.parentId"
					:element-id="element.elementId"
					:children="element.children"
					:label="element.label"
					:parameters="element.parameters"
				/>
			</div>
		</div>
		
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Relationships from './elements/relationships/Relationships'
import Selection from './elements/Selection'
import SingleLineList from './elements/SingleLineList'
import SingleDirectionRelationship from './elements/relationships/SingleDirectionRelationship'
import Drawer from './elements/drawer'
import Headline from './elements/headline/Headline.vue'
import Pharmacy from '~/components/metadata/projectPharmacy/Pharmacy'
import ProjectNumber from '~/components/metadata/projectNumber/projectNumber'
import Status from '~/components/metadata/projectStatus/Status'
import Vorwahl from '~/components/metadata/projectVorwahl/Vorwahl'
import zipCode from '~/components/metadata/projectZipCode/zipCode'
import pharmacyGroup from '~/components/metadata/pharmacyGroup/pharmacyGroup'
import { validationRules } from '~/assets/ValidationParser'
import { NestedArray } from '~/assets/classes/arrayClasses'
export default {
	components: {
		Relationships,
		Selection,
		SingleLineList,
		SingleDirectionRelationship,
		Drawer,
		Headline,
		ProjectNumber,
		Pharmacy,
		Status,
		Vorwahl,
		zipCode,
		pharmacyGroup,
	},
	props: {
		value: { type: Object, required: true }
	},
	data () {
		return {
			form: {},
			nestedArray: null
		}
	},
	// function to return the validation-object for every component
	validations () {
		return { form: validationRules(this.schemaElements) }
	},
	computed: {
		...mapGetters({
			schemaElements: 'schema/getSchemaElements',
			allowedElements: 'authentication/getAllowedElements'
		}),
		watchSchemaElements () {
			return this.schemaElements
		}
	},
	watch: {
		schemaElements: {
			deep: true,
			handler (value) {
				// console.log(value)
				this.nestedArray = new NestedArray(value, 'elementId', undefined).nestedArray
				// console.log(this.nestedArray)
			}
		},
		watchSchemaElements: {
			deep: true,
			handler () {
				for (const name in this.schemaElements) {
					this.$set(this.form, name, null)
				}
			}
		}
	},
	methods: {
		update (key, value) {
			this.form[key] = value
			this.$v.form[key].$touch()
			this.$emit('input', {
				...this.value,
				[key]: value
			})
			this.announceStatus()
		},
		validate () {
			this.$v.$touch()
			this.announceStatus()
		},
		announceStatus () {
			this.$emit('status', {
				invalid: this.$v.$invalid
			})
		}
	}
}
</script>

<style>
</style>