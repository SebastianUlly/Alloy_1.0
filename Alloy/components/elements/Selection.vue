<template>
	<section class="dev_class-to-hide">
		<div
			class="drop-zone"
		>
			<div
				v-for="(selectable, index) of orderedSelectables"
				:key="index"
				class="drag-element"
			>
				<v-icon
					v-if="checkedSelectables.some(item => item.data === selectable.data)"
					@click="removeSelection(selectable)"
				>
					mdi-checkbox-marked
				</v-icon>
				<v-icon
					v-else
					@click="addSelection(selectable)"
				>
					mdi-checkbox-blank-outline
				</v-icon>
				<span>
					{{ selectable.data }}
				</span>
				<v-icon
					v-if="checkedSelectables.some(item => item.data === selectable.data)"
					class="arrow"
					:disabled="diasbleArrowDown(index)"
					@click="moveDown(selectable, index)"
				>
					mdi-arrow-down-bold
				</v-icon>
				<v-icon
					v-if="checkedSelectables.some(item => item.data === selectable.data)"
					class="arrow"
					:disabled="diasbleArrowUp(index)"
					@click="moveUp(selectable, index)"
				>
					mdi-arrow-up-bold
				</v-icon>
			</div>
		</div>
	</section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: {
		elementId: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		hasError: {
			type: Boolean,
			default: false
		}
	},

	data () {
		return {
			selectables: [
				{
					data: 'BIO'
				},
				{
					data: 'VEGGIE'
				},
				{
					data: 'Antiallergen'
				}
			],
			orderedSelectables: [],
			checkedSelectables: []
		}
	},

	computed: {
		...mapGetters({
			fileData: 'file/getFileData',
			schemaElements: 'schema/getSchemaElements'
		}),

		// computed property to return the fileData
		watchFileData () {
			return this.fileData
		},

		watchSelection () {
			return this.checkedSelectables
		},

		watchCheckedSelectables () {
			return this.checkedSelectables
		}
	},

	watch: {
		// watcher to watch the fileData
		watchFileData: {
			deep: true,
			handler () {
				this.findData()
			}
		},

		watchSelection: {
			deep: true,
			handler () {
				this.orderSelectionList()
			}
		},

		watchCheckedSelectables: {
			deep: true,
			handler () {
				const finalDataArray = []
				for (const element of this.checkedSelectables) {
					if (element.data) {
						finalDataArray.push(element)
					}
				}

				const payload = {
					data: JSON.parse(JSON.stringify(finalDataArray)),
					elementId: this.elementId
				}

				this.$store.commit('file/setEnteredData', payload)
			}
		}
	},

	mounted () {
		this.getSchemaData()
	},

	methods: {
		getSchemaData () {
			const element = this.schemaElements.find(item => item.elementId === this.elementId)
			if (element) {
				// console.log(element)
				this.selectables = element.parameters.selectables
			}
			this.findData()
		},

		findData () {
			// finding the data belonging to this element
			const elementData = this.fileData.find(item => item.elementId === this.elementId)
			// if matching data is found
			if (elementData) {
				// assinging the text in file data to this.text
				this.checkedSelectables = elementData.data
			} else {
				// if no data is found this.text is empty
				this.checkedSelectables = []
			}
			this.orderSelectionList()
		},

		// function to add an element to the array of selected elements
		addSelection (selectable) {
			if (!this.checkedSelectables.some(item => item.data === selectable.data)) {
				this.checkedSelectables.push(selectable)
			}
		},

		// function to remove an element from the array of selected elements
		removeSelection (selectable) {
			this.checkedSelectables = this.checkedSelectables.filter(item => item.data !== selectable.data)
		},

		// function to order the list of selectables so that selected items are above unselected ones
		orderSelectionList () {
			this.orderedSelectables = JSON.parse(JSON.stringify(this.checkedSelectables))
			// console.log(this.orderedSelectables)
			for (const selectable of this.selectables) {
				if (!this.orderedSelectables.some(item => item.data === selectable.data)) {
					this.orderedSelectables.push(selectable)
				}
			}
			// console.log(this.orderedSelectables)
		},

		// function to disable the button to move an element down in the array
		diasbleArrowDown (index) {
			if (index === (this.checkedSelectables.length - 1)) {
				return true
			}
			return false
		},

		// function to disable the button to move an element up in the array
		diasbleArrowUp (index) {
			if (index === 0) {
				return true
			}
			return false
		},

		// function to move an element down in the array
		moveDown (item, indexOfItem) {
			const newIndex = indexOfItem + 1
			this.checkedSelectables.splice(indexOfItem, 1)
			this.checkedSelectables.splice(newIndex, 0, item)
		},

		// function to move an element up in the array
		moveUp (item, indexOfItem) {
			const newIndex = indexOfItem - 1
			this.checkedSelectables.splice(indexOfItem, 1)
			this.checkedSelectables.splice(newIndex, 0, item)
		}
	}
}
</script>

<style scoped>
.drop-zone {
margin-top: 10px;
}

.drag-element {
margin-top: 10px;
padding: 5px;
}

.arrow {
	float: right;
}
</style>
