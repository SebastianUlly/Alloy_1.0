<template>
	<div>
		<!-- {{ relationships }} -->
		<div class="tree" :id="elementId">
			<!-- treeview for the selection of new relationships -->
			<v-treeview
				dense
				:items="directoryWithOnlyAllowedEntitiesAndParents"
			>
				<!-- prepending the icons to click on -->
				<template v-slot:prepend="{ item }">
					<div v-if="!item.locked">
						<!-- icon to remove a relationship -->
						<v-icon
							v-if="isTreeItemChecked(item)"
							color="blue"
							@click="removeRelationship(item)"
						>
							mdi-checkbox-marked
						</v-icon>
						<!-- icon to add a relationship -->
						<v-icon
							v-else
							@click="addRelationship(item)"
						>
							mdi-checkbox-blank-outline
						</v-icon>
					</div>
				</template>
				<!-- name of the folder or file -->
				<template v-slot:label="{ item }">
					<div v-if="item.label" class="entity_label">
						{{ item.label }}
						{{ item.checked }}
					</div>
				</template>
			</v-treeview>
		</div>
		<Relationship-list
			:element-id="elementId"
			:schema-ids="schemaIds"
			:relationships-from-database="relationshipsFromDatabase"
			:rela-pos="relaPos"
			:file-to-remove="fileToRemove"
			:file-to-add="fileToAdd"
		/>
	</div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapGetters } from 'vuex'
import { DirectoryOnlyWithAllowedSchemaIds, NestedDirectory } from '~/assets/directoryClasses'

export default {
	props: {
		elementId: {
			type: String,
			required: true
		},
		relationshipsFromDatabase: {
			type: Array,
			required: false,
			default: null
		},
		label: {
			type: String,
			required: true
		},
		hasError: {
			type: Boolean,
			default: false
		}
	},

	data () {
		return {
			element: null,
			directoryWithOnlyAllowedEntitiesAndParents: [],
			schemaIds: [],
			relaPos: [],
			relatedFiles: [],
			fileToRemove: null,
			fileToAdd: null
		}
	},

	computed: {
		...mapGetters({
			fileValues: 'file/getFileValues',
			schemaElements: 'schema/getSchemaElements',
			relationships: 'relationship/getRelationships',
			storeDirestory: 'directory/getDirectory',
			schemaRelationships: 'getSchemaRelationships'
		}),

		watchRelationships () {
			return this.relationships
		}
	},

	watch: {
		watchRelationships: {
			deep: true,
			handler () {
				this.findRelatedFiles()
				this.filterDirectory()
			}
		}
	},

	mounted () {
		this.findSchemaIdsToRelatedElementIds()
		this.findRelatedFiles()
	},

	methods: {
		findSchemaIdsToRelatedElementIds () {
			// console.log(this.schemaRelationships)
			for (const relationshipPossibility of this.schemaRelationships) {
				// console.log(relationshipPossibility.relationship)
				if (relationshipPossibility.relationship.some(item => item.elementId === this.elementId)) {
					const relationshipPossibilities = JSON.parse(JSON.stringify(relationshipPossibility.relationship))
					const index = relationshipPossibilities.findIndex(item => item.elementId === this.elementId)
					relationshipPossibilities.splice(index, 1)
					this.schemaIds.push(relationshipPossibilities[0].schemaId)
					this.relaPos.push(relationshipPossibilities[0])
				}
			}
			this.filterDirectory()
		},

		// function to get te directory for the selection of the relationships
		filterDirectory () {
			// creating a new instance of a directory with only entities of the alowed schemas
			const directory = new DirectoryOnlyWithAllowedSchemaIds(this.storeDirestory, this.schemaIds, this.fileValues.id)

			// looping through the resulting directory
			for (const entity of directory.result) {
				// assigning the locked property to the entity of the directory if it shouldn't be selected
				if (!this.schemaIds.includes(entity.schemaId)) {
					entity.locked = true
				}
			}
			// nesting the directory
			const directoryForTreeview = new NestedDirectory(directory.result)
			// assinging the directory to be used in the whole component
			this.directoryWithOnlyAllowedEntitiesAndParents = directoryForTreeview.unflattenTree(directoryForTreeview.directoryCopy)
		},

		findRelatedFiles () {
			this.relatedFiles = []
			for (const obj of this.relationships) {
				if (obj.fileId === this.fileValues.id) {
					const relatedFile = this.relationships.find(item => item.relationshipId === obj.relationshipId && item.fileId !== this.fileValues.id)
					const relatedFileInDirectory = this.storeDirestory.find(item => item.fileId === relatedFile.fileId && this.schemaIds.includes(item.schemaId))
					if (relatedFileInDirectory) {
						relatedFile.label = relatedFileInDirectory.label
						this.relatedFiles.push(JSON.parse(JSON.stringify(relatedFile)))
					}
				}
			}
		},

		isTreeItemChecked (entity) {
			if (this.relationships.some(item => item.fileId === entity.fileId)) {
				return true
			}
			return false
		},

		// function to add a relationship
		addRelationship (entity) {
			this.fileToAdd = entity
		},

		// function to remove a relationship
		removeRelationship (fileToRemove) {
			this.fileToRemove = fileToRemove
		}
	}
}
</script>

<style>
	.position-container {
		max-width: 50px;
	}

	.position {
		background-color: white;
		max-width: 30px;
	}

	.deletebox-container {
		max-width: 10px;
	}

	.tree {
		/* display: none;
		z-index: 20;
		width: 800px;
		height: 1000px;
		position: absolute; */
	}
</style>
