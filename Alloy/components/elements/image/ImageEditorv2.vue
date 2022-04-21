<template>
	<div>
		<image-uploadv-2
			v-if="openEditor"
			:parameters="parameters"
			@uploaded="fileSuccessfullyUploaded"
		/>
	</div>
</template>

<script>
export default {
	props: {
		parameters: {
			type: Object,
			default: null,
			required: false
		}
	},

	data () {
		return {
			imageData: {
				fileName: '',
				status: ''
			},
			moveImage: '',
			openEditor: true
		}
	},

	methods: {
		// function that is triggered when a file is successfully uploaded (triggered by event emitted from upload component)
		fileSuccessfullyUploaded (data) {
			this.imageData.fileName = data.fileName
			this.openEditor = false

			this.$emit('uploaded', this.imageData)
		}
	}
}
</script>

<style scoped>
img {
	max-width: 150px;
	max-height: 150px;
}
</style>
