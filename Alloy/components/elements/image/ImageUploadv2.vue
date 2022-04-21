<template>
	<div>
		<input
			v-if="!editorActive"
			id="file_input"
			ref="file"
			type="file"
			@change="onLoad"
		>
		<image-editor
			v-else
			:image="file"
			@confirm="confirmCroppedImage"
			@cancel="editorActive = false"
		/>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
			file: null,
			fileName: '',
			editorActive: false
		}
	},

	mounted () {
		const inputElement = document.getElementById('file_input')
		inputElement.click()
	},

	methods: {
		async onLoad () {
			const file = this.$refs.file.files[0]
			if (file) {
				this.file = file

				await this.saveImageToServer()

				this.editorActive = true
			}
		},

		// function that uploads the file to the server
		async saveImageToServer () {
			// creating a new FormData-instance
			const formData = new FormData()
			// appending the file to the formData
			formData.append('file', this.file)
			// try and catch block to upload the file
			try {
				// axios request --> uploading the file
				const res = await axios.post('/api/image/uploadImage/', formData)
				this.fileName = res.data.file.filename
			} catch (err) {
				// catch triggers is upload was unsuccessfull
				console.log(err)
				this.message = 'Something went wrong!!'
			}
		},

		confirmCroppedImage (data) {
			this.editorActive = false
			const payload = {
				fileName: this.fileName,
				croppingData: data
			}

			this.$emit('uploaded', payload)
		}
	}
}
</script>

<style scoped>
#full_image {
	display: none;
}

#file_input {
	display: none;
}
</style>
