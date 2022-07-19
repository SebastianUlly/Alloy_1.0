<template>
	<div v-if="nestedArray">
		<div
			v-for="element of nestedArray"
			:key="element.elementId"
			class="component-container"
		>
			<div>
				<displayComponent
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
import FileId from '~/components/metadata/fileId'
import FileName from '~/components/metadata/fileName'
import FileParents from '~/components/metadata/fileParents'
import { NestedArray } from '~/assets/classes/arrayClasses'
import projectPreview from '~/components/metadata/projectPreview/projectPreview'
import displayComponent from './displayComponent.vue'

export default {
	components: {
		FileId,
		FileName,
		FileParents,
		projectPreview,
		displayComponent
	},
	data () {
		return {
			nestedArray: null
		}
	},
	computed: {
		...mapGetters({
			schemaMetadata: 'schemaEditor/getSchemaMetadata'
		})
	},
	watch: {
		schemaMetadata: {
			deep: true,
			handler (value) {
				this.nestedArray = new NestedArray(value.metadata_elements, 'elementId', undefined).nestedArray
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.component-container {
	position: relative;
	display: flex;
	border: solid 2px white;
	border-radius: 4px;
	margin: 10px 0;
	padding: 5px;
}

.element {
	padding: 20px;
}
</style>