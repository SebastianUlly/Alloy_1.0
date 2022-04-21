<template>
	<div>
		<div v-for="(element, index) of dataElements" :key="index" class="component-container">
			<input
				v-model="element.data"
				type="text"
				class="input"
			>
			<v-icon
				class="arrow-button"
				:disabled="diasbleArrowUp(index)"
				@click="moveElementUp(index)"
			>
				mdi-arrow-up-bold
			</v-icon>
			<v-icon
				class="arrow-button"
				:disabled="diasbleArrowDown(index)"
				@click="moveElementDown(index)"
			>
				mdi-arrow-down-bold
			</v-icon>
		</div>
		<button class="add-button" @click="addNewChild">
			+
		</button>
	</div>
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
			dataElements: [
				{
					data: ''
				}
			]
		}
	},

	computed: {
		...mapGetters({
			fileData: 'file/getFileData',
			schemaElements: 'schema/getSchemaElements',
			saveTrigger: 'infoBox/getSaveTrigger'
		}),

		// computed property to return the fileData
		watchFileData () {
			return this.fileData
		},

		watchDataArray () {
			return this.dataElements
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

		watchDataArray: {
			deep: true,
			handler () {
				const finalDataArray = []
				for (const element of this.dataElements) {
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
		this.findData()
	},

	methods: {
		findData () {
			// finding the data belonging to this element
			const elementData = this.fileData.find(item => item.elementId === this.elementId)
			this.res = elementData
			// if matching data is found
			if (elementData) {
				// assinging the text in file data to this.text
				this.dataElements = elementData.data
			} else {
				this.dataElements = [
					{
						data: ''
					}
				]
			}
		},

		addNewChild () {
			this.dataElements.push(
				{
					data: ''
				}
			)
		},

		diasbleArrowDown (index) {
			if (index === (this.dataElements.length - 1)) {
				return true
			}
			return false
		},

		diasbleArrowUp (index) {
			if (index === 0) {
				return true
			}
			return false
		},

		moveElementUp (index) {
			const oldPosition = index
			const newPosition = index - 1
			this.dataElements.splice(newPosition, 0, this.dataElements.splice(oldPosition, 1)[0])
		},

		moveElementDown (index) {
			const oldPosition = index
			const newPosition = index + 1
			this.dataElements.splice(newPosition, 0, this.dataElements.splice(oldPosition, 1)[0])
		}
	}
}
</script>

<style scoped>
.component.container {
	display: flex;
}

.input {
	background-color: white;
}

.arrow-button {
	position: relative;
	transform: translateY(7%);
}

.add-button {
	font-size: 2em;
}
</style>
