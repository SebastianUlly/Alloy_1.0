<template>
	<div>
		<form enctype="multipart/form-data">
			<!-- input-form to upload a file -->
			<input
				ref="file"
				type="file"
				@change="onChange"
			>
			<!-- <v-btn @click="saveImageToServer()">
				Save
			</v-btn> -->
		</form>
		<div>
			<h5>{{ message }}</h5>
		</div>
		<br>
		<br>
		<!-- <div v-if="image">
			Dateiformat: {{ imageType.split('/')[1] }} <br>
			Dateigröße: {{ imageSize/1000 }} Kb <br>
			Höhe: {{ imageHeight }} <br>
			Breite: {{ imageWidth }}
		</div> -->
	</div>
</template>

<script>
import axios from 'axios'

export default {
	props: {
		parameters: {
			type: Object,
			required: true
		}
	},

	data () {
		return {
			message: '',
			url: '',
			file: null,
			fileName: ''
		}
	},

	methods: {
		async onChange () {
			// types that are allowed to be uploaded
			// const allowedTypes = ['image/jpeg', 'image/jpg', 'image/jfif', 'image/pjpeg', 'image/pjp', 'image/gif', 'image/png', 'image/webp']
			// getting the file from the input-form
			const file = this.$refs.file.files[0]
			// if a file is in the input-form
			if (file) {
				// making the file available to the whole component
				this.file = file
				// // getting the file-type
				// this.imageType = file.type
				// // getting the file size
				// this.imageSize = file.size

				// creating the url of the file in the input form, neccessary for accessing some of the image-data as well as the preview
				this.url = URL.createObjectURL(file)

				// creating a new Image-instance
				this.image = new Image()
				// getting the width and the height of the image
				this.image.onload = function () {
					console.log(this.mimetype)
					const ratio = this.width / 10
					const ratioMet = this.height / 7
					let test
					if (ratio === ratioMet) {
						test = 'true'
					} else {
						test = 'false'
					}
					alert('Breite: ' + this.width + '\n' + 'Höhe: ' + this.height + '\n' + 'Verhältnis stimmt: ' + test + '\n' + 'Dateityp: ' + this.type)
				}
				// assigning the url to the image-source, thus allowing access to the image data
				this.image.src = this.url

				// message if the file is of the wrong type
				// if (!allowedTypes.includes(file.type)) {
				// 	this.message = 'Falsches Dateiformat'
				// }
				// message if the file is of the wrong size
				// if (file.size > 100000) {
				// 	this.message = 'Datei zu groß'
				// }
				await this.saveImageToServer()

				const data = {
					fileName: this.fileName,
					url: this.url
				}
				this.$emit('uploaded', data)
			} else {
				this.url = ''
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
				this.message = 'Uploaded!'
				this.fileName = res.data.file.filename
			} catch (err) {
				// catch triggers is upload was unsuccessfull
				console.log(err)
				this.message = 'Something went wrong!!'
			}
		}
	}
}
</script>
