<template>
	<div>
		<!-- loopng through the children-array with the added data -->
		<div v-for="item of childrenWithData" :key="item.elementId">
			<!-- calling each child an passing the label, original data, and parameters -->
			<component
				:is="item.componentId"
				:label="item.label"
				:data-original="item.dataOriginal"
				:parameters="item.parameters"
				@update="enterData($event, item)"
			/>
		</div>
	</div>
</template>

<script>
// mapGetters is used to get the states in the VUEX-Store
import { mapGetters } from 'vuex'
// import { required } from 'vuelidate/lib/validators'

import { deepCopy } from '~/assets/classes/objectClasses'
// importing the necessary alloy classes from the classes-file
import { GetElementData } from '~/assets/classes/alloyClasses'
import imageUpload from '~/components/elements/lib/imageUpload.vue'
import inputField from '../lib/inputField.vue'

export default {
	inheritAttrs: false,
	props: {
		elementId: {
			type: String,
			required: true
		},
		children: {
			type: Array,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	components: {
		imageUpload,
		inputField
	},

	data () {
		return {
			childrenWithData: null
		}
	},

	computed: {
		...mapGetters({
			fileData: 'file/getFileData'
		})
	},

	watch: {
		// watcher to watch the fileData
		fileData: {
			deep: true,
			handler () {
				// every time the fileData changes the startFunction has to be called
				this.startFunction()
			}
		}
	},

	mounted () {
		// every time the component is mounted the startFunction has to be called
		this.startFunction()
	},

	methods: {
		// function that is called at the beginning
		startFunction () {
			// calling the function to fin the data
			this.findData()
			// looping through all children
			for (const item of this.children) {
				// cunstructing the payload
				const payload = {
					elementId: item.elementId,
					hasChanged: false
				}
				// comitting the hasChanged-object of this child to the hasChanged-array in the store
				this.$store.commit('infoBox/addToHasChangedArray', payload)
			}
		},

		// function to find the data belonging to this element
		findData () {
			// copiyng the children array
			this.childrenWithData = deepCopy(this.children)
			// looping through the children-array
			for (const item of this.childrenWithData) {
				// getting the data belonging the each child
				const data = new GetElementData(this.fileData, item.elementId)
				// checking if data has been found
				if (data.dataFromDatabase) {
					// checking which data has been found --> text or images
					if (data.dataFromDatabase.text) {
						// adding data to child
						item.dataOriginal = data.dataFromDatabase.text
						item.dataToEdit = data.dataFromDatabase.text
					} else if (data.dataFromDatabase.images) {
						// adding data to child
						item.dataOriginal = data.dataFromDatabase.images[0].fileName
						item.dataToEdit = data.dataFromDatabase.images[0].fileName
					}
				} else {
					// if no data has been found --> data is empty
					item.dataOriginal = ''
					item.dataToEdit = ''
				}
			}
		},

		// function that is called whenever a child-component emits data
		enterData (event, item) {
			item.dataToEdit = event
			let payload = {}
			// checking the componentId to create the correct payload
			if (item.componentId === 'imageUpload') {
				payload = {
					elementId: item.elementId,
					data: {
						images: [
							{
								fileName: event
							}
						]
					}
				}
			} else {
				payload = {
					elementId: item.elementId,
					data: {
						text: event
					}
				}
			}
			// commiting the payload to the store
			this.$store.commit('file/setEnteredData', payload)

			// checking if the data is different from the original data to set the hasChanged-property in the store
			if (item.dataToEdit === item.dataOriginal) {
				const payload = {
					elementId: item.elementId,
					hasChanged: false
				}
				// commiting the payload to the store
				this.$store.commit('infoBox/setHasChangedPropertyOfElement', payload)
			} else {
				const payload = {
					elementId: item.elementId,
					hasChanged: true
				}
				// commiting the payload to the store
				this.$store.commit('infoBox/setHasChangedPropertyOfElement', payload)
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
