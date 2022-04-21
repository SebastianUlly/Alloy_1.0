<template>
	<div>
		<ul>
			<li
				v-for="(item, i) of relatedFiles"
				:key="i"
				class="related_file-item"
			>
				<div>
					<v-icon v-if="item.isLeaf && item.hasChanged" style="color: red;">
						mdi-file
					</v-icon>
					<v-icon v-else-if="item.isLeaf && !item.hasChanged" style="color: green;">
						mdi-file
					</v-icon>
					<v-icon v-else>
						mdi-folder
					</v-icon>
					<div class="label" :title="item.label">
						{{ item.label }}
					</div>
				</div>
				<div class="functionality">
					<div title="Position" class="position">
						{{ item.position }}
					</div>
					<v-icon
						class="arrow_down"
						title="Position nach hinten"
						:disabled="disableArrowDown(item)"
						@click="moveDown(item)"
					>
						mdi-arrow-down-bold
					</v-icon>
					<v-icon
						class="arrow_up"
						title="Position nach vorne"
						:disabled="disableArrowUp(item)"
						@click="moveUp(item)"
					>
						mdi-arrow-up-bold
					</v-icon>
					<v-icon
						class="delete"
						title="Löschen"
						@click="removeRelationship(item)"
					>
						mdi-delete
					</v-icon>
				</div>
			</li>
		</ul>
		<ul>
			<li
				v-for="(item, i) of deletedRelatedFiles"
				:key="i"
				class="deleted-related_file-item"
			>
				<div>
					<v-icon v-if="item.isLeaf" style="color: red;">
						mdi-file
					</v-icon>
					<v-icon v-else>
						mdi-folder
					</v-icon>
					<div class="label" :title="item.label">
						{{ item.label }}
					</div>
				</div>
				<div class="functionality">
					<div title="Position" class="position">
						{{ item.position }}
					</div>
					<v-icon
						class="delete"
						title="Löschen"
						@click="addRelationship(item)"
					>
						mdi-delete-restore
					</v-icon>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapGetters } from 'vuex'
import { RelationshipsToElementIdAndFileId, AssignRelationshipsNewPositions, CheckForChanges } from '~/assets/classes/relationships'

export default {
	props: {
		elementId: {
			type: String,
			required: true
		},

		schemaIds: {
			type: Array,
			required: true
		},

		relationshipsFromDatabase: {
			type: Array,
			required: false,
			default: null
		},

		relaPos: {
			type: Array,
			required: false,
			default: null
		},

		fileToRemove: {
			type: Object,
			required: false,
			default: null
		},

		fileToAdd: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			relatedFiles: [],
			deletedRelatedFiles: []
		}
	},

	computed: {
		...mapGetters({
			fileValues: 'file/getFileValues',
			relationships: 'relationship/getRelationships',
			storeDirestory: 'directory/getDirectory'
		}),

		watchRelationships () {
			return this.relationships
		},

		watchRelationshipsFromDatabase () {
			return this.relationshipsFromDatabase
		},

		watchRelatedFiles () {
			return this.relatedFiles
		},

		watchFileToRemoveFromParent () {
			return this.fileToRemove
		},

		watchFileToAddFromParent () {
			return this.fileToAdd
		}
	},

	watch: {
		watchRelationships: {
			deep: true,
			handler () {
				this.findRelatedFiles()
			}
		},

		watchRelationshipsFromDatabase: {
			deep: true,
			handler () {
				this.deletedRelatedFiles = []
				const payload = {
					elementId: this.elementId,
					hasChanged: false
				}
				this.$store.commit('infoBox/addToHasChangedArray', payload)
				this.giveNewPositionToRelationshipsWithoutPosition()
			}
		},

		watchRelatedFiles: {
			deep: true,
			handler () {
				const rel = new CheckForChanges(this.relationshipsFromDatabase, this.relatedFiles)
				if (this.relatedFiles && (this.relatedFiles.some(item => item.hasChanged) || this.deletedRelatedFiles.length > 0)) {
					const payload = {
						elementId: this.elementId,
						hasChanged: true
					}
					this.$store.commit('infoBox/setHasChangedPropertyOfElement', payload)
				} else {
					const payload = {
						elementId: this.elementId,
						hasChanged: false
					}
					this.$store.commit('infoBox/setHasChangedPropertyOfElement', payload)
				}
			}
		},

		watchFileToRemoveFromParent: {
			deep: true,
			handler () {
				this.removeRelationship(this.fileToRemove)
			}
		},

		watchFileToAddFromParent: {
			deep: true,
			handler () {
				this.addRelationship(this.fileToAdd)
			}
		}
	},

	methods: {
		giveNewPositionToRelationshipsWithoutPosition () {
			// creating a new instance of the class to assign new positions to the relationships
			const rel = new AssignRelationshipsNewPositions(this.relationshipsFromDatabase, this.elementId, this.fileValues)
			// storing the edited relationships in the store
			this.$store.commit('relationship/addRelationships', rel.relationshipsWithNewPosition)
		},

		findRelatedFiles () {
			// resetting the relatedFiles-Array on every functioncall
			this.relatedFiles = []
			// creating a new instance of the class to find all files belonging to this element and this file
			const rel = new RelationshipsToElementIdAndFileId(this.relationships, this.elementId, this.fileValues)
			// looping through all relationships
			for (const obj of rel.relationshipsInThisElementToThisFile) {
				// finding the corresponding file in the directory to the related file
				const relatedFileInDirectory = this.storeDirestory.find(item => item.fileId === obj.fileId && this.schemaIds.includes(item.schemaId))
				// checking if a file is found
				if (relatedFileInDirectory) {
					// supplementing the label to the related file
					obj.label = relatedFileInDirectory.label
					// supplementing the isLeaf property to the related file
					obj.isLeaf = relatedFileInDirectory.isLeaf

					obj.schemaId = relatedFileInDirectory.schemaId
					// pushing the related file into the relatedFiles-array
					this.relatedFiles.push(JSON.parse(JSON.stringify(obj)))
				}
			}
			// sorting the relatedFiles-array by position
			this.relatedFiles.sort(function (a, b) {
				return a.position - b.position
			})
		},

		// function to remove a relationship
		removeRelationship (fileToRemove) {
			if (fileToRemove && !this.deletedRelatedFiles.find(item => item.fileId === fileToRemove.fileId)) {
				fileToRemove.position = 'd'
				this.deletedRelatedFiles.push(fileToRemove)
				const fullRelationShipsArrayCopy = JSON.parse(JSON.stringify(this.relationships))

				const fileToRemoveInRelationships = fullRelationShipsArrayCopy.find(item => item.fileId === fileToRemove.fileId)
				if (fileToRemoveInRelationships) {
					for (const obj of fullRelationShipsArrayCopy) {
						// console.log(obj.fileId, fileToRemove.fileId)
						if (obj.position > fileToRemoveInRelationships.position) {
							// console.log(obj.position)
							obj.position -= 1
							// console.log(obj.position)
						}
					}

					this.$store.commit('relationship/setRelationships', fullRelationShipsArrayCopy)

					// looping through every relationship in the store
					for (const relationship of this.relationships) {
						// if the fileId of the relationship from the store matches the fileId of the relationship to be removed
						if (relationship.fileId === fileToRemove.fileId && relationship.elementId === this.elementId) {
							// passing thie relationshipId to the store mutation to remove the relationship
							this.$store.commit('relationship/deleteRelationships', relationship.relationshipId)
						}
					}
				}
			}
		},

		// function to add a relationship
		addRelationship (entity) {
			if (entity) {
				const newRaltionshipId = uuidv4()

				const relationshipData = this.relaPos.find(item => item.schemaId === entity.schemaId)
				console.log(entity, relationshipData)

				// rel1 and rel2 are the new relationship (both ways)
				const rel1 = {
					relationshipId: newRaltionshipId,
					fileId: this.fileValues.id,
					position: null,
					elementId: relationshipData.elementId
				}

				const rel2 = {
					relationshipId: newRaltionshipId,
					fileId: entity.fileId,
					position: this.relatedFiles.length + 1,
					elementId: this.elementId
				}

				// making an array of rel1 and rel2 in order to pass it on to the store mutation
				const relArr = [rel1, rel2]

				// adding the new relationship to the store
				this.$store.commit('relationship/addRelationships', relArr)
				// removing the file from the deletedRelatedFiles-array
				this.deletedRelatedFiles = this.deletedRelatedFiles.filter(item => item.fileId !== entity.fileId)
			}
		},

		disableArrowDown (item) {
			if (item.position === this.relatedFiles.length) {
				return true
			}
			return false
		},

		disableArrowUp (item) {
			if (item.position === 1) {
				return true
			}
			return false
		},

		moveDown (fileToMove) {
			const fullRelationShipsArrayCopy = JSON.parse(JSON.stringify(this.relationships))
			const fileAtTargetPosition = this.relatedFiles.find(item => item.position === fileToMove.position + 1)

			const fileAtTargetPositionInFullReltionshipsArray = fullRelationShipsArrayCopy.find(item => item.fileId === fileAtTargetPosition.fileId)
			fileAtTargetPositionInFullReltionshipsArray.position -= 1

			const fileToMoveInFullRelationshipsArray = fullRelationShipsArrayCopy.find(item => item.fileId === fileToMove.fileId)
			fileToMoveInFullRelationshipsArray.position += 1

			this.$store.commit('relationship/setRelationships', fullRelationShipsArrayCopy)
		},

		moveUp (fileToMove) {
			const fullRelationShipsArrayCopy = JSON.parse(JSON.stringify(this.relationships))
			const fileAtTargetPosition = this.relatedFiles.find(item => item.position === fileToMove.position - 1)

			const fileAtTargetPositionInFullReltionshipsArray = fullRelationShipsArrayCopy.find(item => item.fileId === fileAtTargetPosition.fileId)
			fileAtTargetPositionInFullReltionshipsArray.position += 1

			const fileToMoveInFullRelationshipsArray = fullRelationShipsArrayCopy.find(item => item.fileId === fileToMove.fileId)
			fileToMoveInFullRelationshipsArray.position -= 1

			this.$store.commit('relationship/setRelationships', fullRelationShipsArrayCopy)
		}
	}
}
</script>

<style scoped>
ul {
	position: relative;
}

.related_file-item {
	display: flex;
	position: relative;
	justify-content: space-between;
	margin: 5px 0 0 0;
}

.deleted-related_file-item {
	display: flex;
	position: relative;
	justify-content: space-between;
	margin: 5px 0 0 0;
}

.label {
	margin: 0 0 0 10px;
	white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

li div {
	display: flex;
}

.position {
	background-color: transparent;
}

.deleted-related_file-item:after {
  position: absolute;
  left: 0;
  top: 50%;
  height: 1px;
  background: #c00;
  content: "";
  width: 100%;
  display: block;
}
</style>
