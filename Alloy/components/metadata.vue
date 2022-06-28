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
import FileId from '~/components/metadata/fileId'
import FileName from '~/components/metadata/fileName'
import FileParents from '~/components/metadata/fileParents'
import { validationRules } from '~/assets/ValidationParser'
import { NestedArray } from '~/assets/classes/arrayClasses'
import projectPreview from '~/components/metadata/projectPreview/projectPreview'
export default {
	components: {
		FileId,
		FileName,
		FileParents,
		projectPreview,
	},
	data () {
		return {
			nestedArray: null
		}
	},
	computed: {
		...mapGetters({
			schemaMetadata: 'schema/getSchemaMetadata'
		})
	},
	watch: {
		schemaMetadata: {
			deep: true,
			handler (value) {
				this.nestedArray = new NestedArray(value, 'elementId', undefined).nestedArray
			}
		}
	}
}
</script>

<style>
	.element {
		padding: 20px;
	}
</style>