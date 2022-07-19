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
			<vue-json-pretty :data="element" />
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
		<button @click="addNewElement()">
			Neues Element
		</button>
	</div>
</template>

<script>
import ParentComponent from './elementEditor/parentElement.vue'
import displayComponent from './displayComponent.vue'

import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { NestedArray } from '~/assets/classes/arrayClasses'

export default {
	components: {
		ParentComponent,
		displayComponent
	},
	data () {
		return {
			nestedArray: null
		}
	},
	computed: {
		...mapGetters({
			schemaElements: 'schemaEditor/getSchemaElements'
		})
	},
	watch: {
		schemaElements: {
			deep: true,
			handler (value) {
				this.nestedArray = new NestedArray(value, 'elementId', undefined).nestedArray
			}
		}
	},

	methods: {
		addNewElement () {
			const id1 = uuidv4()
			const id2 = uuidv4()

			let nextPosition = 1
			
			let elementsArrayWithOnlyRootElements = this.schemaElements.filter(item => item.parentId === 0)
			if (elementsArrayWithOnlyRootElements) {
				const highestPosition = Math.max(...elementsArrayWithOnlyRootElements.map(obj => obj.position))
				if (highestPosition > 0) {
					nextPosition = highestPosition + 1
				}
			}

			const newElement = [
				{
					"label": "",
					"parentId": 0,
					"position": nextPosition,
					"elementId": id1,
					"componentId": "projectNumber",
					"validations": {}
				},
				{
					"label": "",
					"parentId": id1,
					"position": 1,
					"elementId": id2,
					"parameters": {
						"required": false
					},
					"componentId": "inputField",
					"validations": {}
				},
			]

			this.$store.commit('schemaEditor/addNewElement', newElement)
		},

		moveDown (elementId) {
			const payload = {
				elementId,
				direction: 'down'
			}
			this.$store.commit('schemaEditor/moveElementByElementId', payload)
		},

		moveUp (elementId) {
			const payload = {
				elementId,
				direction: 'up'
			}
			this.$store.commit('schemaEditor/moveElementByElementId', payload)
		}
	},
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