<template>
	<div>
		<!-- upload-component thats used to upload a file -->
		<image-editorv-2
			v-if="openEditor"
			:parameters="parameters"
			@uploaded="fileSuccessfullyUploaded"
		/>
		<!-- container to display the image and data of the entry (only active if upload-component is not) -->
		<div v-else>
			<div v-if="data.editingParameters.newlyUploaded">
				<img
					:src="'/uploads/' + data.fileName"
					alt=""
				>
				<!-- icon to display that the entry (opsition of the entry) has not been saved -->
				<v-icon style="color: red;">
					mdi-content-save-alert
				</v-icon>
			</div>
			<div v-else>
				<img
					:src="'/images/' + data.fileName"
					alt=""
				>
			</div>
			<single-line-text :label="'Alternativ-Name'" />
			<!-- <v-text-field v-model="imageData.alternateName" /> -->
			<single-line-text :label="'Alt-Text'" />
			<!-- <v-text-field v-model="imageData.altText" /> -->
			<v-btn @click="openEditor = true">
				Upload
			</v-btn>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
	props: {
		dataFromDataBase: {
			type: Object,
			required: true
		},
		data: {
			type: Object,
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		hasError: {
			type: Boolean,
			default: false
		},
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
				altText: '',
				alternateName: ''
			},
			moveImage: '',
			openEditor: false,
			dataCopy: null
		}
	},

	computed: {
		...mapGetters({
			saveTrigger: 'infoBox/getSaveTrigger'
		}),

		watchData () {
			return this.data
		},

		watchSaveTrigger () {
			return this.saveTrigger
		}
	},

	watch: {
		watchData: {
			deep: true,
			handler () {
				this.imageData = this.data
			}
		},

		watchSaveTrigger () {
			this.moveImageFromUploadsToImage()
			this.moveImageFromImagesToBin()
		}
	},

	mounted () {
		this.imageData = this.data
		this.dataCopy = JSON.parse(JSON.stringify(this.data))
	},

	methods: {
		altTextChange () {
			if (this.dataCopy.altText !== this.data.altText) {
				return true
			}
			return false
		},

		alternateNameChange () {
			if (this.dataCopy.alternateName !== this.data.alternateName) {
				return true
			}
			return false
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
					this.imageData.fileName = ''
					this.imageData.url = ''
				}
			}
		},

		// function to move the uploaded file from uploads into image, is triggerd when the fileData is saved to the database
		async moveImageFromUploadsToImage () {
			const oldPath = '/static/uploads/' + this.imageData.fileName
			const newPath = '/static/images/' + this.imageData.fileName
			await axios.put('api/image/moveImage', null, {
				params: {
					oldPath,
					newPath
				}
			})
		},

		// function that is triggered when a file is successfully uploaded (triggered by event emitted from upload component)
		fileSuccessfullyUploaded (data) {
			this.imageData.fileName = data.fileName
			this.imageData.editingParameters.newlyUploaded = true
			this.moveImage = 'UPLOADED'
			this.openEditor = false
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

img {
	max-width: 150px;
	max-height: 150px;
}
</style>
