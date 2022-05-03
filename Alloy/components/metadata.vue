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
		<!-- <vue-json-pretty :data="nestedArray" /> -->
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pharmacy from '~/components/metadata/projectPharmacy/Pharmacy'
import FileId from '~/components/metadata/fileId'
import FileName from '~/components/metadata/fileName'
import FileParents from '~/components/metadata/fileParents'
import ProjectNumber from '~/components/metadata/projectNumber/projectNumber'
import { validationRules } from '~/assets/ValidationParser'
import Status from '~/components/metadata/projectStatus/Status'
import Vorwahl from '~/components/metadata/projectVorwahl/Vorwahl'
import { NestedArray } from '~/assets/classes/arrayClasses'
import zipCode from '~/components/metadata/projectZipCode/zipCode'

export default {
	components: {
		FileId,
		FileName,
		FileParents,
		ProjectNumber,
		Pharmacy,
		Status,
		Vorwahl,
		zipCode,
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
		return { form: validationRules(this.schemaMetadata) }
	},

	computed: {
		...mapGetters({
			schemaMetadata: 'schema/getSchemaMetadata'
		}),

		// computed property to return the schema-metadata
		watchSchemaMetadata () {
			return this.schemaMetadata
		}
	},

	watch: {
		schemaMetadata: {
			deep: true,
			handler (value) {
				// console.log(value)
				this.nestedArray = new NestedArray(value, 'elementId', undefined).nestedArray
				// console.log(this.nestedArray)
			}
		},

		watchSchemaMetadata: {
			deep: true,
			handler () {
				for (const name in this.schemaMetadata) {
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
	.element {
		padding: 20px;
	}
</style>
