<template>
	<div>
		<!-- {{ fileData }} -->
		<!-- {{ schemaIds }} -->
		<div>
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
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import { DirectoryOnlyWithAllowedSchemaIds, NestedDirectory } from '~/assets/directoryClasses'

export default {
	props: {
		elementId: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			directoryWithOnlyAllowedEntitiesAndParents: [],
			fileIds: []
		}
	},

	computed: {
		...mapGetters({
			fileValues: 'file/getFileValues',
			fileData: 'file/getFileData',
			schemaElements: 'schema/getSchemaElements',
			storeDirestory: 'directory/getDirectory'
		}),

		watchFileIds () {
			return this.fileIds
		}
	},

	watch: {
		watchFileIds: {
			deep: true,
			handler () {
				const payload = {
					elementId: this.elementId,
					data: {
						fileIds: JSON.parse(JSON.stringify(this.fileIds))
					}
				}
				this.$store.commit('file/setEnteredData', payload)
			}
		}
	},

	mounted () {
		this.filterDirectory()
		this.findData()
	},

	methods: {
		findData () {
			for (const item of this.fileData) {
				if (item.elementId === this.elementId) {
					this.fileIds = JSON.parse(JSON.stringify(item.data.fileIds))
				}
			}
		},

		// function to get te directory for the selection of the relationships
		filterDirectory () {
			const elementData = this.schemaElements.find(item => item.elementId === this.elementId)

			// creating a new instance of a directory with only entities of the alowed schemas
			const directory = new DirectoryOnlyWithAllowedSchemaIds(this.storeDirestory, elementData.parameters.selectedSchemaIds, this.fileValues.id)

			// looping through the resulting directory
			for (const entity of directory.result) {
				// assigning the locked property to the entity of the directory if it shouldn't be selected
				if (!elementData.parameters.selectedSchemaIds.includes(entity.schemaId)) {
					entity.locked = true
				}
			}
			// nesting the directory
			const directoryForTreeview = new NestedDirectory(directory.result)
			// assinging the directory to be used in the whole component
			this.directoryWithOnlyAllowedEntitiesAndParents = directoryForTreeview.unflattenTree(directoryForTreeview.directoryCopy)
		},

		isTreeItemChecked (entity) {
			if (this.fileIds.some(item => item === entity.fileId)) {
				return true
			}
			return false
		},

		// function to add a relationship
		addRelationship (entity) {
			if (!this.fileIds.includes(entity.fileId)) {
				this.fileIds.push(entity.fileId)
			}
		},

		// function to remove a relationship
		removeRelationship (entity) {
			const index = this.fileIds.findIndex(item => item === entity.fileId)
			this.fileIds.splice(index, 1)
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
</style>
