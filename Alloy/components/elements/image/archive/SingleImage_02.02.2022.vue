<template>
	<div>
		<div v-if="url">
			<!-- filename that can't be changed (name of the file at save-location) -->
			<span>Dateiname:</span>
			<v-text-field v-model="fileName" :disabled="true" />
			<!-- filename to display the file with on the website -->
			<!-- <span>Alternativname:</span>
			<v-text-field v-model="alternateName" /> -->
			<!-- filename to display the file with on the website -->
			<!-- <span>Alt-Text:</span>
			<v-text-field v-model="altText" /> -->
			<!-- img tag to display a preview of the image -->
			<img
				:src="url"
				width="30%"
				height="30%"
			>
			<!-- delete-button to delete a picture -->
			<v-btn @click="deleteImage()">
				Delete
			</v-btn>

			<div v-for="(element, key) of childElements" :key="element.elementId">
				<h4>
					{{ element.label }}
				</h4>
				<component
					:is="element.componentId"
					:key="key"
					:element-id="element.elementId"
					:name="element.label"
					:label="element.label"
					v-bind="{ ...element }"
					:has-error="$v.form[key].$error"
					@input="update(key, $event)"
				/>
			</div>
		</div>
		<!-- upload-component thats used to upload a file -->
		<!-- <FileUpload
			v-else
			:parameters="parameters"
			@uploaded="fileSuccessfullyUploaded"
		/> -->
	</div>
</template>

<script>
import axios from 'axios'

import { mapGetters } from 'vuex'

// import FileUpload from './FileUpload'

import { validationRules } from '~/assets/ValidationParser'

export default {
	// components: {
	// 	FileUpload
	// },

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
		},
		parameters: {
			type: Object,
			default: null,
			required: false
		}
	},

	data () {
		return {
			fileName: '',
			// alternateName: '',
			// altText: '',
			url: '',
			moveImage: '',
			childElements: [],
			form: {}
		}
	},

	// function to return the validation-object for every component
	validations () {
		return { form: validationRules(this.childElements) }
	},

	computed: {
		...mapGetters({
			schemaElements: 'schema/getSchemaElements',
			fileData: 'file/getFileData',
			saveTrigger: 'infoBox/getSaveTrigger'
		}),

		watchFileData () {
			return this.fileData
		},

		watchSchemaElements () {
			return this.schemaElements
		},

		watchChildElements () {
			return this.childElements
		},

		watchFileName () {
			return this.fileName
		},

		// watchAlternateName () {
		// 	return this.alternateName
		// },

		watchSaveTrigger () {
			return this.saveTrigger
		}
	},

	watch: {
		// watcher to watch the schemaElements
		watchSchemaElements: {
			deep: true,
			handler () {
				// assigning an empty array to this.childElements
				this.childElements = []
				// looping through every element in schemaElements
				for (const element of this.schemaElements) {
					// comparing the parentId to the elementId of this element
					if (element.parentId === this.elementId) {
						// if a matching element is found --> pushing that element to this.childElements
						this.childElements.push(element)
					}
				}
			}
		},

		watchChildElements: {
			deep: true,
			handler () {
				for (const name in this.childElements) {
					this.$set(this.form, name, null)
				}
			}
		},

		// watcher to set the new values for the input fileds
		watchFileData: {
			deep: true,
			handler () {
				this.findData()
			}
		},

		watchFileName () {
			const payload = {
				data: {
					fileName: this.fileName
					// alternateName: this.alternateName
				},
				elementId: this.elementId
			}
			this.$store.commit('file/setEnteredData', payload)
		},

		// watchAlternateName () {
		// 	const payload = {
		// 		data: {
		// 			fileName: this.fileName,
		// 			alternateName: this.alternateName
		// 		},
		// 		elementId: this.elementId
		// 	}
		// 	this.$store.commit('file/setEnteredData', payload)
		// },

		watchSaveTrigger () {
			this.moveImageFromUploadsToImage()
			this.moveImageFromImagesToBin()
		}
	},

	mounted () {
		this.findData()
		for (const element of this.schemaElements) {
			if (element.parentId === this.elementId) {
				this.childElements.push(element)
			}
		}
	},

	methods: {
		findData () {
			// finding the data belonging to this element
			const elementData = this.fileData.find(item => item.elementId === this.elementId)
			// if matching data is found
			if (elementData) {
				// assinging the file name in file data to this.fileName
				this.fileName = elementData.data.fileName
				// this.alternateName = elementData.data.alternateName
				this.getImage()
			} else {
				// if no data is found this.fileName is empty
				this.fileName = ''
				// this.alternateName = ''
				this.url = ''
			}
		},

		getImage () {
			// checkig if a fileName exists to call the image with
			if (this.fileName) {
				this.url = '/images/' + this.fileName
			} else {
				this.url = ''
			}
		},

		deleteImage () {
			this.fileToDelete = this.fileName
			this.fileName = ''
			// this.alternateName = ''
			this.url = ''
			this.moveImage = 'DELETE'
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
					// this.alternateName = ''
					this.url = ''
				}
			}
		},

		// function to move the uploaded file from uploads into image, is triggerd when the fileData is saved to the database
		moveImageFromUploadsToImage () {
			const oldPath = '/static/uploads/' + this.fileName
			const newPath = '/static/images/' + this.fileName
			axios.put('api/image/moveImage', null, {
				params: {
					oldPath,
					newPath
				}
			})
		},

		// function that is triggered when a file is successfully uploaded (triggered by event emitted from upload component)
		fileSuccessfullyUploaded (data) {
			// console.log(data)
			this.url = data.url
			this.fileName = data.fileName
			// this.alternateName = data.alternateName
			this.moveImage = 'UPLOADED'
		},

		update (key, value) {
			// console.log(key, value)
			this.form[key] = value
			// console.log(this.$v.form[key])
			this.$v.form[key].$touch()

			this.$emit('input', {
				...this.value,
				[key]: value
			})

			// this.announceStatus()
		},
		announceStatus () {
			this.$emit('status', {
				invalid: this.$v.$invalid
			})
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
