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
		</div>

		<div
			v-else
		>
			<div>
				{{ fileName }}
			</div>
			<div class="button-container">
				<button
					@click="deleteFile"
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
			moveFile: ''
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
			return '/files/' + this.fileName
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
			this.moveFileFromUploadsToFiles()
			this.moveFileFromFilesToBin()
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
				this.moveFile = ''
			} else {
				this.fileName = ''
				this.editorActive = false
				this.enableUpload = true
				this.newlyUploaded = false
				this.moveFile = ''
			}
		},

		async onLoad () {
			const file = this.$refs.file.files[0]
			if (file) {
				this.file = file

				await this.saveFileToServer()

				this.editorActive = true
				this.enableUpload = false
			}
		},

		// function that uploads the file to the server
		async saveFileToServer () {
			// creating a new FormData-instance
			const formData = new FormData()
			// appending the file to the formData
			formData.append('file', this.file)
			// try and catch block to upload the file
			try {
				// axios request --> uploading the file
				const res = await axios.post('/api/file/uploadFile/', formData)
				console.log(res)
				this.fileName = res.data.file.filename
				console.log(this.fileName)
			} catch (err) {
				// catch triggers is upload was unsuccessfull
				console.log({ err })
				this.message = 'Something went wrong!!'
			}
		},

		deleteFile () {
			console.log('klsdjhf')
			this.enableUpload = true
			this.fileToDelete = this.fileName
		},

		// function to delete a file => file is moved from files-folder to bin
		async moveFileFromFilesToBin () {
			if (this.fileToDelete) {
				// defining the old and new paths of the file => file is moved by renming the paths
				const oldPath = '/static/files/' + this.fileToDelete
				const newPath = '/static/files/bin/' + this.fileToDelete
				// axios request with the old and new path to move the file
				const res = await axios.put('api/files/moveFile', null, {
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

		// function to move the uploaded file from uploads into files, is triggerd when the fileData is saved to the database
		async moveFileFromUploadsToFiles () {
			const oldPath = '/static/uploads/' + this.fileName
			const newPath = '/static/files/' + this.fileName
			await axios.put('api/file/moveFile', null, {
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
// @import '../../../assets/scss/componets/imageUpload.scss';
</style>
