<template>
	<div class="input dev_class-to-hide">
		<input
			:id="name"
			v-model="text"
			:class="{
				'error': hasError,
				'green': !hasError
			}"
			v-bind="$attrs"
			:aria-describedby="`${name}-error`"
			v-on="{
				...$listeners,
				input: event => $emit('input', event.target.value)
			}"
		>
		<!-- <p :id="`${name}-error`" class="error" v-if="hasError && error">
			{{ error }}
		</p> -->
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	inheritAttrs: false,
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
			text: ''
		}
	},

	computed: {
		...mapGetters({
			fileData: 'file/getFileData'
		}),

		// computed property to return the fileData
		watchFileData () {
			return this.fileData
		},

		// computed property to return the entered text
		watchText () {
			return this.text
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

		// watcher to watch the entered text
		watchText () {
			// constructing the payload
			const payload = {
				elementId: this.elementId,
				data: {
					text: this.text
				}
			}
			// calling the store mutation to comit the entered text to the store
			this.$store.commit('file/setEnteredData', payload)
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
				this.text = elementData.data.text
			} else {
				// if no data is found this.text is empty
				this.text = ''
			}
		}
	}
}
</script>

<style scoped>
input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
input.error {
  border-color: #721c24;
}
input.green {
  border-color: green;
  border-width: 2px;
}
</style>
