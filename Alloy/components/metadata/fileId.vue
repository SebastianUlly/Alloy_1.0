<template>
	<div>
		<div
			v-for="item of childrenWithData"
			:key="item.elementId"
		>
			<component
				:is="item.componentId"
				:label="item.label"
				:data-original="item.textOriginal"
				:parameters="item.parameters"
				@update="enterText($event, item)"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import inputField from '~/components/elements/lib/inputField'
import { deepCopy } from '~/assets/classes/objectClasses'

export default {
	components:{
		inputField
	},
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

	data () {
		return {
			childrenWithData: null
		}
	},

	computed: {
		...mapGetters({
			fileValues: 'file/getFileValues'
		})
	},

	watch: {
		// watcher to watch the fileData
		fileValues: {
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
				if (this.fileValues.id) {
					this.fileName = this.fileValues.id
					item.textOriginal = this.fileValues.id
					item.textToEdit = this.fileValues.id
				} else {
					item.textOriginal = ''
					item.textToEdit = ''
				}
			}
		},

		enterText (event, item) {
			item.textToEdit = event
			this.fileName = event
			const payload = this.fileName
			this.$store.commit('file/setFileIdToEnteredValues', payload)

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

<style scoped>

</style>

