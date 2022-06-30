<template>
	<v-card>
		<div class="button-container">
			<button @click="NewFile()">
			 +	Neue Datei erstellen
			</button>
		</div>
		<div
			class="select-container"
			:style="disableSelect ? 'opacity: 0.4' : 'opacity: 1'"
		>
			<div class="select-label">Schema</div>
			<span class="selectedSchemaLabel">
				{{ selectedSchema.label }}
			</span>
			<select
				v-model="selectedSchema"
				:class="disableSelect ? 'schema-select' : 'schema-select active'"
				name=""
				:disabled="disableSelect"
			>
				<option disabled value="">
					Bitte wählen Sie ein Schema
				</option>
				<option
					v-for="(item, index) of schema"
					:key="index"
					:value="item"
				>
					{{ item.label }}
				</option>
			</select>
		</div>
		<Metadata/>
		<Elements/>
		<!-- save button -->
		<div class="button-container">
			<button
				:disabled="disableSaveBtn"
				:style="disableSaveBtn ? 'opacity: 0.4' : 'opacity: 1'"
				@click="saveFile"
				:class="{disabled: disableSaveBtn}"
			>
				Datei Speichern
			</button>
		</div>
	</v-card>
</template>

<script>
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'

import { mapGetters } from 'vuex'
import { ParentOfEntity, EditEntity, AddEntityToDirectory } from '../../assets/directoryClasses'
import { hasAnythingChanged } from '../../assets/functions/hasChanged'

import 'vue-json-pretty/lib/styles.css'

import Metadata from '~/components/metadata'
import Elements from '~/components/elements'

export default {
	components: {
		Metadata,
		Elements
	},

	props: {
		schema: {
			type: Array,
			required: true
		}
	},

	data () {
		return {
			selectedSchema: '',
			disableSelect: false
		}
	},

	computed: {
		...mapGetters({
			storeDirectory: 'directory/getDirectory',
			clickedEntityFileId: 'directory/getClickedEntityFileId',
			schemaValues: 'schema/getSchemaValues',
			fileData: 'file/getFileData',
			fileValues: 'file/getFileValues',
			dataToSave: 'file/getDataToSave',
			valuesToSave: 'file/getValuesToSave',
			directoryId: 'directory/getDirectoryId',
			hasChangedArray: 'infoBox/getHasChangedArray'
		}),

		// computed property to determine if the copy button has to be disabled
		disableSaveBtn () {
			// returning the result of the function that checks the hasChangedArray for any changes
			return !hasAnythingChanged(this.hasChangedArray)
		},

		// computed property to return the id of the selected schema in the select-element
		watchSelectedSchema () {
			return this.selectedSchema.id
		},
	},

	watch: {
		// watcher to watch the fileId of the clicked entity
		clickedEntityFileId () {
			this.getLatestDirectory()
			// calling the function to get the data of file from the database
			this.getFileDataToId(this.clickedEntityFileId)
		},

		// watcher to watch the selected schema
		watchSelectedSchema () {
			// calling the store mutation to reset the entered data from the different elements in the store because a new schema has been selected
			this.$store.commit('file/resetEnteredData')

			this.$store.commit('file/setSchemaIdToEnteredValues', this.selectedSchema.id)
			// calling the function to get the schema from the database
			this.getSchemaDataToId(this.selectedSchema.id)
		}
	},

	methods: {
		getLatestDirectory () {
			this.$apollo.query({
				variables: {
					directoryId: this.directoryId
				},

				query: gql`
					query (
						$directoryId: Int
					) {
						directory (
							directoryId: $directoryId
						) {
							id
							hierarchy
						}
					}
				`
			}).then((data) => {
				if (data.data.directory) {
					this.$store.commit('directory/setDirectoryId', data.data.directory[0].id)

					this.$store.commit('directory/setDirectoryFromDatabase', data.data.directory[0].hierarchy)
				}
			}).catch((error) => {
				console.log({ error })
			})
		},

		// function to get the file data to the clicked file
		getFileDataToId (fileId) {
			this.$store.commit('infoBox/resetHasChangedArray')
			if (fileId) {
				this.$apollo.query({
					variables: {
						id: fileId
					},
	
					query: gql`
						query (
							$id: String
						) {
							queryFileData (
								id: $id
							) {
								id
								label
								data
								schemaId
							}
						}
					`
				}).then((data) => {
					// setting the disableSelect variable to true because the schema of an existing file can't be changed
					this.disableSelect = true
					// calling the function to get the schema from the database
					this.getSchemaDataToId(data.data.queryFileData.schemaId)
					// extracting the fileData
					const fileData = data.data.queryFileData
	
					// finding the parents to the fileId of the clicked entity
					const parentsToFile = new ParentOfEntity(this.storeDirectory)
					const parentIds = parentsToFile.getAllParentsToFile(fileData.id)
	
					// assinging the parentIds property to the fileData with hthe found parentIds
					fileData.parentIds = parentIds
					// calling the store mutation to "store" the fileData in the store
					this.$store.commit('file/setFile', fileData)
				}).catch((error) => {
					console.log({ error })
				})
			}
		},

		// function to get the schema data to the selected schema (selected by select element or the schemaId of the clicked file)
		getSchemaDataToId (schemaId) {
			this.$apollo.query({
				variables: {
					id: schemaId
				},

				query: gql`
					query(
						$id: String
					) {
						querySchemaById (
							id: $id
						) {
							id
							label
							metadata
							elements
						}
					}
				`
			}).then((data) => {
				// xtracting the schema data
				const schemaData = data.data.querySchemaById
				// assinging to the selectedSchema variable the id and label of the fetched schema (neccessary when a entity in the directory has been clicked)
				this.selectedSchema = {
					id: schemaData.id,
					label: schemaData.label,
					isLeaf: schemaData.metadata.isLeaf
				}
				// calling the store mutation to "store" the schemaData in the store
				this.$store.commit('schema/setSchema', schemaData)
			}).catch((error) => {
				console.log({ error })
			})
		},

		// function to that is called when the button to create a new file is clicked
		NewFile () {
			// setting the disableSelect variable to false, because the select statement hs to be enabled for a new file
			this.disableSelect = false
			// calling the store mutation to reset the fileData and set a new fileId for the file to be created
			this.$store.commit('file/resetFile', uuidv4())
		},

		saveFile () {
			if (this.disableSelect) {
				this.updateFile()
			} else {
				this.createFile()
			}
		},

		updateFile () {
			this.$apollo.mutate({
				variables: {
					metadata: this.valuesToSave,
					elementsData: this.dataToSave
				},

				mutation: gql`
					mutation (
						$metadata: JSON
						$elementsData: JSON
					) {
						updateFile (
							metadata: $metadata
							elementsData: $elementsData
						) {
							id
						}
					}
				`
			}).then((data) => {
				// console.log(data)

				this.$store.commit('infoBox/setSaveTrigger')

				// create a new instance to add or remove the entity to the directory on every reqired location to change the name
				const directoryWithChangedName = new EditEntity(this.storeDirectory)
				// calling the function on the new instance to change the name
				directoryWithChangedName.changeName(this.valuesToSave.fileId, this.valuesToSave.label)

				// create a new instance to add or remove the entity to the directory on every reqired location to add or remove the updated file on every required location
				const directoryWithAddedEntity = new AddEntityToDirectory(
					directoryWithChangedName.directoryCopy,
					{
						fileId: this.valuesToSave.fileId,
						label: this.valuesToSave.label,
						schemaId: this.valuesToSave.schemaId,
						isLeaf: this.selectedSchema.isLeaf
					},
					this.valuesToSave.parentIds)
				// committing the changed directory to the store
				this.$store.commit('directory/setToStoreDirectory', directoryWithAddedEntity.directoryCopy)
				this.getFileDataToId(this.clickedEntityFileId)
			}).catch((error) => {
				console.log({ error })
			})
		},

		createFile () {
			this.$apollo.mutate({
				variables: {
					metadata: this.valuesToSave,
					elementsData: this.dataToSave
				},

				mutation: gql`
					mutation (
						$metadata: JSON
						$elementsData: JSON
					) {
						createFile (
							metadata: $metadata
							elementsData: $elementsData
						) {
							id
						}
					}
				`
			}).then((data) => {
				this.$store.commit('infoBox/setSaveTrigger')

				// create a new instance to add the file to the directory on every reqired location
				const directoryWithAddedEntity = new AddEntityToDirectory(
					this.storeDirectory,
					{
						fileId: this.valuesToSave.fileId,
						label: this.valuesToSave.label,
						schemaId: this.valuesToSave.schemaId,
						isLeaf: this.selectedSchema.isLeaf
					},
					this.valuesToSave.parentIds)
				// commiting the edited directory to the store
				this.$store.commit('directory/setToStoreDirectory', directoryWithAddedEntity.directoryCopy)
				this.getFileDataToId(data.data.createFile.id)
			}).catch((error) => {
				console.log({ error })
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables.scss';

.select-container {
	width: 100%;
	padding: 1.5*$standard-value;
	position: relative;

	.selectedSchemaLabel {
		position: absolute;
		z-index: 1;
		top: 2.8*$standard-value;
		left: 3.1*$standard-value;
		font-size: 1.75*$standard-value;
	}
}

.schema-select {
	position: relative;
	border: 0.2*$standard-value solid white;
	border-radius: 0.4*$standard-value;
	padding: $standard-value;
	color: white;
	width: 100%;
	font-size: 1.8*$standard-value;

	option {
		color: black;
	}
}

.active {
	background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") no-repeat;
	background-position: calc(100% - 0.75rem) center !important;
	-moz-appearance:none !important;
	-webkit-appearance: none !important; 
	appearance: none !important;
	padding-right: 2rem !important;
}

.button-container {
	padding:10px 0;
	width: 100%;
	display: flex;
	justify-content: center;
}

button {
	padding: 1*$standard-value;
	color: #ffffff;
	background-color: #28a745;
	border: 0.1*$standard-value solid #28A144; 
	border-radius: 0.4*$standard-value;
	transition-duration: 0.4s;
}
button:hover:not(.disabled) {
  background-color:#30c553;
  color: white;
}

.select-label {
	position: absolute;
	max-width: 76%;
	left: 2*$standard-value;
	top: 0.6*$standard-value;
	padding: 0 0.6*$standard-value;
	color: white;
	background-color: #1E1E1E;
	z-index: 10;
	font-size: 13px;
}
</style>
