<template>
	<section>
		<!-- looping through all the entries in the images-array -->
		<div v-for="(item, index) of images" :key="index">
			<!-- {{ item.deleted }} -->
			<div v-if="!item.editingParameters.deleted">
				<div class="functionality">
					<!-- <div title="Position" class="position">
						{{ item.position }}
					</div> -->
					<!-- icon to move the entry down -->
					<v-icon
						class="arrow_down"
						title="Position nach hinten"
						:disabled="item.position === images.length"
						@click="moveDown(item)"
					>
						mdi-arrow-down-bold
					</v-icon>
					<!-- icon to move the entry up -->
					<v-icon
						class="arrow_up"
						title="Position nach vorne"
						:disabled="item.position === 1"
						@click="moveUp(item)"
					>
						mdi-arrow-up-bold
					</v-icon>
					<!-- icon to delete the entry -->
					<v-icon
						class="delete"
						title="Löschen"
						@click="toggleDeletedImage(index)"
					>
						mdi-delete
					</v-icon>
					<!-- icon to display that the entry (opsition of the entry) has not been saved -->
					<has-changed-indicator
						:old-data="itemToId(item.id).position"
						:new-data="item.position"
					/>
				</div>
				<!-- calling the single-image-component for each entry -->
				<single-image-for-multi-imagev-2
					:parameters="parameters.imageSpecs"
					:data-from-data-base="itemToId(item.id)"
					:data="item"
					:index="index"
				/>
			</div>
			<div v-else>
				<span style="color: red;">Eintrag gelöscht!</span>
				<v-icon style="color: red;">
					mdi-content-save-alert
				</v-icon>
				<v-icon style="color: green;" @click="toggleDeletedImage(index)">
					mdi-content-save-check
				</v-icon>
			</div>
		</div>
		<!-- button to add a new entry -->
		<v-btn v-if="disableAddButton" @click="addImage">
			Neues Bild
		</v-btn>
	</section>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapGetters } from 'vuex'

import { CopyArray, SortPositionsOfElements, ChangePosition, CheckForChanges } from '~/assets/classes/arrayClasses'

export default {
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
			images: [],
			imagesFromDataBase: [],
			counter: 0
		}
	},

	computed: {
		...mapGetters({
			schemaElements: 'schema/getSchemaElements',
			fileData: 'file/getFileData',
			saveTrigger: 'infoBox/getSaveTrigger'
		}),

		// computed property to disable the button that adds another image
		disableAddButton () {
			// getting the number of allowed images from the schema
			const numberOfImages = this.schemaElements.find(item => item.elementId === this.elementId).parameters.numberOfImages
			// checking if the number of allowed images is bigger than the total amount of images already in place
			if (numberOfImages > this.images.length) {
				return true
			}
			return false
		},

		// computed property to return the fileData from the store
		watchFileData () {
			return this.fileData
		},

		// computed property to return the images-array
		watchImageArray () {
			return this.images
		},

		watchImagesFromDatabase () {
			return this.imagesFromDataBase
		}
	},

	watch: {
		// watcher to watch the fileData from the store
		watchFileData: {
			deep: true,
			handler () {
				// calling the findData-functiion every time the fileData in the store changes
				this.findData()
			}
		},

		// watcher to watch the images-array for changes
		watchImageArray: {
			deep: true,
			handler () {
				// filtering the deleted items from the images-array
				const imagesArrayWithoutDeleteItems = this.images.filter(item => !item.editingParameters.deleted)
				// copying the images-array by creating a new instance of the CopyArray-class
				const imagesCopy = new CopyArray(imagesArrayWithoutDeleteItems).arrayCopy
				// console.log(this.images)
				// looping through the array and deleting unnecessary properties before writing to the store
				for (const item of imagesCopy) {
					delete item.editingParameters
				}
				// constructing the payload for this element, the payload consists of the elementId and images-array
				const payload = {
					elementId: this.elementId,
					data: {
						images: JSON.parse(JSON.stringify(imagesCopy))
					}
				}
				// commiting the images-array to the store
				this.$store.commit('file/setEnteredData', payload)

				// checking for changes in the images-array compared to the data from the database by creating a new instance of the ChangeForChanges-class
				const imageChange = new CheckForChanges(this.imagesFromDataBase, this.images)
				// checking if any changes in the array have occured
				if (this.images && this.images.some(item => item.editingParameters.hasChanged)) {
					// if changes have occured:

					// preparing the payload, consisting of the elementId and hasChanged-property = true
					const payload = {
						elementId: this.elementId,
						hasChanged: true
					}
					// commiting the payload to the store
					this.$store.commit('infoBox/setHasChangedPropertyOfElement', payload)
				} else {
					// if no changes have occured:

					// preparing the payload, consisting of the elementId and hasChanged-property = false
					const payload = {
						elementId: this.elementId,
						hasChanged: false
					}
					// commiting the payload to the store
					this.$store.commit('infoBox/setHasChangedPropertyOfElement', payload)
				}
			}
		},

		watchImagesFromDatabase: {
			deep: true,
			handler () {
				const payload = {
					elementId: this.elementId,
					hasChanged: false
				}
				this.$store.commit('infoBox/addToHasChangedArray', payload)
			}
		}
	},

	mounted () {
		this.findData()
	},

	methods: {
		findData () {
			// find the data to this element
			const dataToElement = this.fileData.find(item => item.elementId === this.elementId)
			// checking if data has been found
			if (dataToElement && dataToElement.data.images) {
				// copying the images-array by creating a new instance of the CopyArray-class, this is the control -array to check for changes
				this.imagesFromDataBase = new CopyArray(dataToElement.data.images).arrayCopy
				// copying the images-array a second time, this is the working array for the component
				this.images = new CopyArray(this.imagesFromDataBase).arrayCopy
				// adding a 'editingParameters'-property to every item in the array
				for (const item of this.images) {
					// at the beginning every 'deleted'- & 'hasChanged'-property is false
					item.editingParameters = {
						deleted: false,
						hasChanged: false
					}
				}
			} else {
				// if no data has been found the images-array is empty
				this.images = []
			}
		},

		// function to return the data of the entry in the array from the database belonging to the new item
		itemToId (id) {
			// finding the old item by the id
			const item = this.imagesFromDataBase.find(item => item.id === id)
			// checking if an item has been founnd
			if (item) {
				// if an item has been found returning it
				return item
			} else {
				// if no item has been found returning the basic unfilled data
				return {
					altText: null,
					alternateName: null,
					position: null
				}
			}
		},

		// function to add a new and empty image-entry
		addImage () {
			// pushing a new empty image-entry into the array
			this.images.push({
				id: uuidv4(),
				fileName: '',
				altText: '',
				alternateName: '',
				position: this.images.length + 1,
				editingParameters: {
					deleted: false,
					hasChanged: false
				}
			})
		},

		toggleDeletedImage (index) {
			// copying the images-array by creating a new instance of the CopyArray-class,
			const imagesArrayCopy = new CopyArray(this.images).arrayCopy
			// toggling the deleted property of the editingParameters
			imagesArrayCopy[index].editingParameters.deleted = !imagesArrayCopy[index].editingParameters.deleted
			// setting the position to null
			imagesArrayCopy[index].position = null
			// sorting the order of the array
			this.images = new SortPositionsOfElements(imagesArrayCopy).arrayCopy
		},

		// function to move the element up (forward) in the array
		moveUp (item) {
			// new instance of the ChangePositionClass
			this.images = new ChangePosition(this.images, item.position, 'UP').arrayCopy
		},

		// function to move the element down (back) in the array
		moveDown (item) {
			// new instance of the ChangePositionClass
			this.images = new ChangePosition(this.images, item.position, 'DOWN').arrayCopy
		}
	}
}
</script>

<style scoped>
.functionality {
	display: flex;
}

.position {
	background-color: transparent;
}
</style>
