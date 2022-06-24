<template>
	<div>
		<div>
			<div
				class="input"
			>
				<!-- input-field -->
				<input
					v-model="search"
					type="text"
					placeholder=" "
					class="input__field"
				>
				<!-- label to the input-field -->
				<span class="input__label">
					Suche
				</span>
			</div>
			<v-treeview
				:items="nestedDirectory"
				:search="search"
				:filter="filter"
				:active.sync="active"
				activatable
				return-object
			>
				<!-- prepending the according tho the node (folder-closed or folder opened or file) -->
				<template v-slot:prepend="{ item, open }">
					<v-icon v-if="item.isLeaf === false">
						{{ open ? 'mdi-folder-open' : 'mdi-folder' }}
					</v-icon>
					<v-icon v-else-if="item.isLeaf === true">
						mdi-file
					</v-icon>
					<v-icon v-else>
						mdi-alert-circle
					</v-icon>
				</template>
				<template v-slot:label="{ item }">
					<div v-if="item.label" class="entity_label">
						{{ item.label }}
					</div>
					<div v-else>
						DATEI NICHT GEFUNDEN
					</div>
				</template>
				<!-- appending the neccessery icons tho the node -->
				<template v-slot:append="{ item }">
					<v-icon
						:disabled="disableDeleteButton(item)"
						@click="deleteEntity(item)"
					>
						mdi-delete
					</v-icon>
					<!-- arrow down to move the node "down" in its array, down = in the direction of the bottom of the website -->
					<v-icon
						:disabled="disableArrowDown(item)"
						@click="moveDown(item)"
					>
						mdi-arrow-down-bold
					</v-icon>
					<!-- arrow up to move the node "up" in its array, up = in the direction of the top of the website -->
					<v-icon
						:disabled="disableArrowUp(item)"
						@click="moveUp(item)"
					>
						mdi-arrow-up-bold
					</v-icon>
					<!-- eye-symbol to indicate and change the visibility of the entries in the directory -->
					<v-icon
						v-if="item.isVisible"
						:disabled="allowEdit"
						@click="changeVisibilityOfEntity(item)"
					>
						mdi-eye
					</v-icon>
					<v-icon
						v-else
						:disabled="allowEdit"
						@click="changeVisibilityOfEntity(item)"
					>
						mdi-eye-off
					</v-icon>
				</template>
			</v-treeview>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag'

import { mapGetters } from 'vuex'

import {
	NestedDirectory,
	MainDirectory,
	EditEntity,
	MoveEntityInBranch,
	DeleteEntityInBranch,
	ReorderPosition
} from '~/assets/directoryClasses'

export default {
	props: {
		files: {
			type: Array,
			required: true
		},
		schema: {
			type: Array,
			required: true
		},
		editable: {
			type: Boolean,
			required: true
		},
		fileClicked: {
			type: Boolean,
			required: true
		}
	},

	data () {
		return {
			rawDirectory: [],
			active: [],
			search: '',
			caseSensitive: false
		}
	},

	computed: {
		...mapGetters({
			storeDirectory: 'directory/getDirectory',
			databaseDirectory: 'directory/getDatabaseDirectory',
			relationshipsFromStore: 'relationship/getRelationships'
		}),

		watchDatabaseDirectory () {
			return this.databaseDirectory
		},

		allowEdit () {
			return !this.editable
		},

		watchFileClickedInBin () {
			return this.fileClicked
		},

		watchClickedFile () {
			return this.active
		},

		nestedDirectory () {
			const directoryForTreeview = new NestedDirectory(this.$store.getters['directory/getDirectory'])
			const nestedTree = directoryForTreeview.unflattenTree(directoryForTreeview.directoryCopy)
			return nestedTree
		},

		// computed property to watch the changes in the directory
		watchDirectoryForChanges () {
			return this.storeDirectory
		},

		filter () {
			return this.caseSensitive
				? (item, search, textKey) => item[textKey].indexOf(search) > -1
				: undefined
		},
	},

	watch: {
		watchDatabaseDirectory: {
			deep: true,
			handler () {
				this.completeDirectory()
			}
		},

		// watcher to watch the changes in the directory and save it to the database
		watchDirectoryForChanges: {
			// deep is needed to watch changeds in an array or object, works also for deeply nested arrays and objects
			deep: true,
			// handler function is called when the watcher detects a change
			handler () {
				this.saveDirectory()
			}
		},

		watchClickedFile: {
			deep: true,
			handler () {
				if (this.active.length > 0) {
					this.$store.commit('directory/assignClickedEntityFileId', this.active[0].fileId)
					this.$store.commit('directory/assignClickedEntityId', this.active[0].id)
					this.$emit('clicked')
				}
			}
		},

		watchFileClickedInBin () {
			if (!this.fileClicked) {
				this.active = []
			}
		}
	},

	created () {
		this.$apollo.query({
			query: gql`
				query {
					directory {
						id
						hierarchy
					}
				}
			`
		}).then((data) => {
			this.$store.commit('directory/setDirectoryId', data.data.directory[0].id)
			this.$store.commit('directory/setDirectoryFromDatabase', data.data.directory[0].hierarchy)
		}).catch((error) => {
			console.log({ error })
		})
	},

	// mounted () {
	// 	this.completeDirectory()
	// },

	methods: {
		completeDirectory () {
			// function that takes in the raw data which are fetched when this component is created and processing so that a useable directory is formed
			// creating new instance by calling the MainDirectory class and passing it the raw data in the arguments
			const directory = new MainDirectory(this.databaseDirectory, this.files, this.schema)
			// storing the newly created directory in the store
			this.$store.commit('directory/setToStoreDirectory', directory)
		},

		// function to diasable the delete button --> depends on if a folder contains any files
		disableDeleteButton (entity) {
			if (!this.editable || this.storeDirectory.some(item => item.parentId === entity.id)) {
				return true
			}
			return false
		},

		// function to disable the arrow up button --> depends on the position (if on first position --> can't move up)
		disableArrowUp (entity) {
			if (!this.editable || entity.position === 1) {
				return true
			}
			return false
		},

		// function to disable the arrow down button --> depends on the position (if on last position --> can't move down)
		disableArrowDown (entity) {
			const siblingArray = this.storeDirectory.filter(item => item.parentId === entity.parentId)
			if (!this.editable || siblingArray.length === entity.position) {
				return true
			}
			return false
		},

		changeVisibilityOfEntity (entity) {
			// create new instance by calling the EditEntity class and passing it the directory from the store and the id of the entity it needs to edit
			const directoryWithChangedVisibiityOnEntity = new EditEntity(this.$store.getters['directory/getDirectory'])
			// calling the function to change the Visibility on the newly created instance
			directoryWithChangedVisibiityOnEntity.changeVisibility(entity.id)
			// storing the changed directory back in the store
			this.$store.commit('directory/setToStoreDirectory', directoryWithChangedVisibiityOnEntity.directoryCopy)
		},

		moveDown (entity) {
			// create new instance by calling the MoveEntityInBranch class and passing it the directory from the store and the id of the entity it needs to move
			const directoryWithMovedEntity = new MoveEntityInBranch(this.$store.getters['directory/getDirectory'])
			// calling the function, on the newly created instance, to move the Entity in the branch
			directoryWithMovedEntity.moveDown(entity.id)
			// storing the changed directory back in the store
			this.$store.commit('directory/setToStoreDirectory', directoryWithMovedEntity.directoryCopy)
		},

		moveUp (entity) {
			// create new instance by calling the MoveEntityInBranch class and passing it the directory from the store and the id of the entity it needs to move
			const directoryWithMovedEntity = new MoveEntityInBranch(this.$store.getters['directory/getDirectory'])
			// calling the function, on the newly created instance, to move the Entity in the branch
			directoryWithMovedEntity.moveUp(entity.id)
			// storing the changed directory back in the store
			this.$store.commit('directory/setToStoreDirectory', directoryWithMovedEntity.directoryCopy)
		},

		deleteEntity (entity) {
			// create new instance to delete the entity from the directory
			const directoryWithDeletedEntity = new DeleteEntityInBranch(this.$store.getters['directory/getDirectory'], entity.id)
			// create new instance with the directory where the entity has been removed to reorder the positions
			const rorderingDirectory = new ReorderPosition(directoryWithDeletedEntity.arrayWithDeletedEntity)
			// reorder the positions of the entities with the same parentId --> in the same folder
			const rorderedDirectoryWithDeletedEntity = rorderingDirectory.inEntity(entity.parentId)
			// commit the edited directory to the store
			this.$store.commit('directory/setToStoreDirectory', rorderedDirectoryWithDeletedEntity)

			this.deleteRelationships(entity)
		},

		// function to save the changed directory (SUL)
		saveDirectory () {
			this.$apollo.mutate({
				variables: {
					directory: this.$store.getters['directory/getDirectory']
				},

				mutation: gql`
					mutation(
						$directory: JSON
					) {
						saveDirectory(
							directory: $directory
						) {
							id
						}
					}
				`
			}).then(() => {
			}).catch((error) => {
				console.log({ error })
			})
		},

		// function to delete the relationships the file in this entity might have, if it's finally deleted from the directory
		deleteRelationships (entity) {
			// finding all the entities with the same fileId as the entity
			const entitiesWithSameFileId = this.storeDirectory.filter(item => item.fileId === entity.fileId)
			// if the fileId is found at least once
			if (entitiesWithSameFileId.length === 0) {
				// finding the relationships of the file
				const relationships = this.relationshipsFromStore.filter(item => item.fileId === entity.fileId)
				// creating an empty array for the realtionshipIds
				const relationshipIds = []
				for (const rela of relationships) {
					// pushing the relationshipIds into the relationshipId array
					relationshipIds.push(rela.relationshipId)
				}

				// deleting all the relationships by relationshipId
				this.$apollo.mutate({
					variables: {
						data: relationshipIds
					},

					mutation: gql`
						mutation (
							$data: JSON
						) {
							deleteRelationships (
								data: $data
							)
						}
					`
				}).then(() => {
				}).catch((error) => {
					console.log({ error })
				})
			}
		},

		clickedOrphanedFile () {
			this.active = []
		}
	}
}
</script>

<style scoped lang="scss">
@import '../assets/scss/componets/inputField.scss';

.entity_label {
	padding-left: 15px
}
</style>
