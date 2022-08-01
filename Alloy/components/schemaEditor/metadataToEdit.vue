<template>
	<div v-if="nestedArray">
		<div
			v-for="element of nestedArray"
			:key="element.elementId"
			class="component-container"	
		>
			<ParentComponent
				class="component"
				v-if="!element.parentId && element.children.length"
				:element-id="element.elementId"
				:children="element.children"
				:label="element.label"
				:parameters="element.parameters"
			/>
			<display-component
				v-else
				class="component"
				:label="element.label"
				:element-id="element.elementId"
				:parameters="element.parameters"
			/>
			<!-- <vue-json-pretty :data="element" /> -->
			<div class="move-icons-container">
				<v-icon
					@click="moveDown(element.elementId)"
				>
					mdi-arrow-down-bold
				</v-icon>
				<!-- arrow up to move the node "up" in its array, up = in the direction of the top of the website -->
				<v-icon
					@click="moveUp(element.elementId)"
				>
					mdi-arrow-up-bold
				</v-icon>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NestedArray } from '~/assets/classes/arrayClasses'
import displayComponent from './displayComponent.vue'

import ParentComponent from './elementEditor/parentElement.vue'

export default {
	components: {
		displayComponent,
		ParentComponent
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
	},

	methods: {
		moveDown (elementId) {
			const payload = {
				elementId,
				direction: 'down'
			}
			this.$store.commit('schemaEditor/moveMetadataElementByElementId', payload)
		},

		moveUp (elementId) {
			const payload = {
				elementId,
				direction: 'up'
			}
			this.$store.commit('schemaEditor/moveMetadataElementByElementId', payload)
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

.component {
	width: 100%;
}

.move-icons-container {
	display: flex;
}
</style>