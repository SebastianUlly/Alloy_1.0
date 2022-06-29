<template>
	<div>
		<!-- treeview to display the directory of the "deleted" files -->
		<v-treeview
			:items="orphanDirectory"
			:active.sync="active"
			activatable
			return-object
		>
			<!-- template to prepend the file-icons for each item -->
			<template v-slot:prepend="{ item, open }">
				<!-- icon for he bin (open and closed) -->
				<v-icon v-if="item.root">
					{{ open ? 'mdi-delete-empty' : 'mdi-delete' }}
				</v-icon>
				<!-- icon for the files -->
				<v-icon v-else-if="item.isLeaf">
					mdi-file
				</v-icon>
				<!-- icon for the folders -->
				<v-icon v-else>
					mdi-folder
				</v-icon>
			</template>
			<!-- template to display the label of each item -->
			<template v-slot:label="{ item }">
				<div class="entity_name">
					{{ item.label }}
				</div>
			</template>
			<!-- template to append the icon to delete an entity for each item -->
			<template v-slot:append="{ item }">
				<v-icon
					v-if="item.fileId"
					:disabled="!editable"
					@click="deleteFile(item)"
				>
					mdi-cancel
				</v-icon>
			</template>
		</v-treeview>
		
	</div>
</template>

<script>
import gql from 'graphql-tag'
import { mapGetters } from 'vuex'

import { OrphanedFiles } from '~/assets/directoryClasses'

export default {
	props: {
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
			active: [],
			orphanDirectory: [],
			files: []
		}
	},

	computed: {
		...mapGetters({
			storeDirectory: 'directory/getDirectory'
		}),

		// computed property to retun this.active (if in this component a file has been clicked)
		watchClickedFile () {
			return this.active
		},

		// computed property to return this.fileClicked (if in directory a file has been clicked)
		watchFileClicked () {
			return this.fileClicked
		}
	},

	watch: {
		// watcher to watch if a file has been clicked in this component
		watchClickedFile: {
			deep: true,
			handler () {
				// checking that there is an entry in this.active
				if (this.active.length > 0) {
					// assinging thie clicked fileId to the store
					this.$store.commit('directory/assignClickedEntityFileId', this.active[0].fileId)
					// emmiting the event to tell the container- and then the directory-component that a file has been clicked
					this.$emit('clicked')
				}
			}
		},

		// watcher to watch if a file has been clicked in the directory-component
		watchFileClicked () {
			// checking if a file has been clicked or unclicked
			if (!this.fileClicked) {
				// resetting this.active --> thus unmarking any clicked file in this component
				this.active = []
			}
		},

		// watcher to watch the files
		files: {
			deep: true,
			handler () {
				// calling the function to generate the directory of the "deleted" files
				this.getOrphanDirectory()
			}
		},

		// watcher to watch the directory in the store
		storeDirectory: {
			deep: true,
			handler () {
				// calling the function to generate the directory of the "deleted" files
				this.getOrphanDirectory()
			}
		}
	},

	mounted () {
		this.fetchFiles()
	},

	methods: {
		// function to generate the directory of the "deleted" files
		getOrphanDirectory () {
			// creating a new instance of OrphanFiles by passing the directory from the store, the files and the schemes as arguments
			const orphanedFiles = new OrphanedFiles(this.storeDirectory, this.files, this.schema)
			// assinging the newly created directory to this.orphanDirectory
			this.orphanDirectory = [
				{
					id: 'orphan',
					root: true,
					label: 'Papierkorb',
					children: orphanedFiles.orphanedFiles
				}
			]
		},

		// function to finally delete a file from the database
		deleteFile (item) {
			this.active = []
			this.$apollo.mutate({
				variables: {
					fileId: item.fileId
				},

				mutation: gql`
					mutation (
						$fileId: String
					) {
						deleteFile (
							fileId: $fileId
						)
					}
				`
			}).then((data) => {
				console.log(data.data.deleteFile)
				// if the deletion of the file has been successfull
				if (data.data.deleteFile) {
					// calling the function to fetch the files from the directory again
					this.fetchFiles()
				}
			}).catch((error) => {
				console.log({ error })
			})
		},

		// function to fetch the files from the database
		fetchFiles () {
			this.$apollo.query({
				query: gql`
					query {
						files {
							fileId: id
							label
							schemaId
						}
					}
				`
			}).then((data) => {
				// overwriting the files with the fresh files from the database
				this.files = data.data.files
			}).catch((error) => {
				console.log({ error })
			})
		},

		fetchNewDirectory () {
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
		}
	}
}
</script>
