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
import projectName from '~/components/metadata/projectName/projectName'
import Status from '~/components/metadata/projectStatus/Status'
import pharmacyGroup from '~/components/metadata/pharmacyGroup/pharmacyGroup'
import { validationRules } from '~/assets/ValidationParser'
import { NestedArray } from '~/assets/classes/arrayClasses'
import projectList from './elements/projectList/projectList'
import projectDate from '~/components/metadata/projectDate/projectDate'
import projectNumber from '~/components/metadata/projectNumber/projectNumber'
import pharmacyAbb from '~/components/metadata/pharmacyAbb/pharmacyAbb'
import selectFromDatabase from '~/components/metadata/selectFromDatabase/selectFromDatabase'
import SingleLineText from '~/components/elements/singleLineText/SingleLineText'
export default {
	components: {
		projectList,
		Relationships,
		Selection,
		SingleLineList,
		SingleDirectionRelationship,
		Drawer,
		Headline,
		projectName,
		Pharmacy,
		Status,
		pharmacyGroup,
		projectDate,
		projectNumber,
		pharmacyAbb,
		selectFromDatabase,
		SingleLineText
	},
	data () {
		return {
			nestedArray: null
		}
	},
	computed: {
		...mapGetters({
			schemaElements: 'schema/getSchemaElements'
		})
	},
	watch: {
		schemaElements: {
			deep: true,
			handler (value) {
				this.nestedArray = new NestedArray(value, 'elementId', undefined).nestedArray
			}
		}
	}
}
</script>

<style>
</style>