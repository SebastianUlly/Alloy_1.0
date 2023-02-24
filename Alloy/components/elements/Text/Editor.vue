# name: Editor
# author: Sebastian ULLY
# type: alloy element
# version: 1.0
# date: 04.02.2022
# external dependents: /
# internal dependents: /

<template>
	<div>
		<div v-for="item of childrenWithData" :key="item.elementId">
			<component
				:is="item.componentId"
				:label="item.label"
				:parameters="item.parameters"
				:data-original="item.textOriginal"
				@update="enterText($event, item)"
			/>
			<!-- <vue-json-pretty :data="item" /> -->
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
import quillEditor from '../lib/quillEditor.vue'

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
		quillEditor
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
				this.startFunction()
			}
		}
	},

	mounted () {
		this.startFunction()
	},

	methods: {
		startFunction () {
			this.findData()
			for (const item of this.children) {
				const payload = {
					elementId: item.elementId,
					hasChanged: false
				}
				this.$store.commit('infoBox/addToHasChangedArray', payload)
			}
		},

		findData () {
			this.childrenWithData = deepCopy(this.children)
			for (const item of this.childrenWithData) {
				const data = new GetElementData(this.fileData, item.elementId)
				if (data.dataFromDatabase) {
					console.log(item)
					if (data.dataFromDatabase.content) {
						item.textOriginal = data.dataFromDatabase.content
						item.textToEdit = data.dataFromDatabase.content
					} else {
						item.textOriginal = data.dataFromDatabase.text
						item.textToEdit = data.dataFromDatabase.text
					}
				} else {
					item.textOriginal = ''
					item.textToEdit = ''
				}
			}
		},

		enterText (event, item) {
			// console.log(item.textToEdit, item.textOriginal)
			item.textToEdit = event
			const payload = {
				elementId: item.elementId,
				data: {
					text: event
				}
			}
			this.$store.commit('file/setEnteredData', payload)

			if (item.textToEdit === item.textOriginal) {
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

<style scoped lang="scss">
</style>
