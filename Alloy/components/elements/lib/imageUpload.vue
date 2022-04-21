<template>
	<div>
		<div v-if="enableUpload">
			<div v-if="!editorActive">
				<label for="file-upload" class="custom-file-upload">
					<div class="line vertical-line" />
					<div class="line horizontal-line" />
				</label>
				<input
					id="file-upload"
					ref="file"
					type="file"
					@change="onLoad"
				>
			</div>

			<image-editor
				v-if="editorActive"
				:image="file"
				:parameters="parameters"
				@confirm="confirmCroppedImage"
				@cancel="editorActive = false"
			/>
		</div>

		<div
			v-else
			class="thumbnail-container"
		>
			<div v-if="newlyUploaded">
				<img
					class="thumbnail"
					:src="url"
					alt=""
				>
			</div>
			<div v-else>
				<img
					class="thumbnail"
					:src="url"
					alt=""
				>
			</div>
			<div class="button-container">
				<button
					@click="deleteImage"
				>
					Löschen
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
	props: {
		label: {
			type: String,
			required: false,
			default: ''
		},
		dataOriginal: {
			type: String,
			required: false,
			default: ''
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			file: null,
			fileName: '',
			editorActive: false,
			newlyUploaded: false,
			enableUpload: true,
			moveImage: ''
		}
	},

	computed: {
		...mapGetters({
			saveTrigger: 'infoBox/getSaveTrigger'
		}),

		url () {
			if (this.newlyUploaded) {
				return '/uploads/' + this.fileName
			}
			return '/images/' + this.fileName
		}
	},

	watch: {
		dataOriginal () {
			this.startFunction()
		},

		fileName () {
			this.$emit('update', this.fileName)
		},

		saveTrigger () {
			this.moveImageFromUploadsToImage()
			this.moveImageFromImagesToBin()
		}
	},

	mounted () {
		this.startFunction()
	},

	methods: {
		startFunction () {
			if (this.dataOriginal) {
				this.fileName = this.dataOriginal
				this.editorActive = false
				this.enableUpload = false
				this.newlyUploaded = false
				this.moveImage = ''
			} else {
				this.fileName = ''
				this.editorActive = false
				this.enableUpload = true
				this.newlyUploaded = false
				this.moveImage = ''
			}
		},

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
			this.newlyUploaded = true
			this.moveImage = 'UPLOADED'
			this.enableUpload = false
			const payload = {
				data: {
					fileName: this.fileName,
					croppingData: data
				}
			}

			this.$emit('uploaded', payload)
		},

		deleteImage () {
			console.log('klsdjhf')
			this.enableUpload = true
			this.fileToDelete = this.fileName
		},

		// function to delete a image => image is moved from imagefolder to bin
		async moveImageFromImagesToBin () {
			if (this.fileToDelete) {
				// defining the old and new paths of the file => file is moved by renming the paths
				const oldPath = '/static/images/' + this.fileToDelete
				const newPath = '/static/images/bin/' + this.fileToDelete
				// axios request with the old and new path to move the file
				const res = await axios.put('api/image/moveImage', null, {
					params: {
						oldPath,
						newPath
					}
				})
				// if the put request/moving of the file was successfull "deleting" the filename and the url => setting to ''
				if (res.data === 'Successfully deleted') {
					this.fileName = ''
					this.url = ''
				}
			}
		},

		// function to move the uploaded file from uploads into image, is triggerd when the fileData is saved to the database
		async moveImageFromUploadsToImage () {
			const oldPath = '/static/uploads/' + this.fileName
			const newPath = '/static/images/' + this.fileName
			await axios.put('api/image/moveImage', null, {
				params: {
					oldPath,
					newPath
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/componets/imageUpload.scss';
</style>
