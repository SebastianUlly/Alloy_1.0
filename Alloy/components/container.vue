<template>
	<div>
		<v-card max-width="400px">
			<!-- button to toggle the editability of the directory and the orpahned files -->
			<v-btn @click="edit()">
				Bearbeiten
			</v-btn>
			<!-- directory-component -->
			<Directory
				:files="files"
				:schema="schema"
				:editable="allowEdit"
				:file-clicked="fileClicked.directory"
				@clicked="directoryClicked"
			/>
			<!-- component for the orphaned files -->
			<OrphanedFiles
				:files="files"
				:schema="schema"
				:editable="allowEdit"
				:file-clicked="fileClicked.orphanedFiles"
				@clicked="orphanedFilesClicked"
			/>
		</v-card>
		<!-- <vue-json-pretty :data="$store.getters['directory/getDirectory']" /> -->
	</div>
</template>

<script>
import Directory from './directory'
import OrphanedFiles from './orphanedFiles'

export default {
	components: {
		Directory,
		OrphanedFiles
	},

	props: {
		files: {
			type: Array,
			required: true
		},
		schema: {
			type: Array,
			required: true
		}
	},

	data () {
		return {
			allowEdit: false,
			fileClicked: {
				directory: false,
				orphanedFiles: false
			}
		}
	},

	methods: {
		// function to switch between true and false of the this.allowEdit variable
		edit () {
			this.allowEdit = !this.allowEdit
		},

		// function that is called when an entity in the directory has been clicked
		directoryClicked () {
			this.fileClicked = {
				directory: true,
				orphanedFiles: false
			}
		},

		// function that is called when an entity in orphanedFiles is clicked
		orphanedFilesClicked () {
			this.fileClicked = {
				directory: false,
				orphanedFiles: true
			}
		}
	}
}
</script>
