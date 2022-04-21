import Vue from 'vue'
// import { ParentOfEntity } from '~/assets/directoryClasses'
import { NestedArray } from '../assets/classes/arrayClasses'

export const state = () => ({
	directoryId: 0,
	directoryFromDatabase: [],
	directory: [],
	clickedEntityFileId: '',
	clickedEntityId: '',
	nestedDirectory: []
})

export const mutations = {
	setDirectoryId (state: object, id: number) {
		Vue.set(state, 'directoryId', id)
	},

	// to assign the given directory, to the store
	setToStoreDirectory (state: object, directoryToBeSet: { id: string, parentId: string, position: number}[]) {
		Vue.set(state, 'directory', directoryToBeSet)

		const nestedDirectory = new NestedArray(directoryToBeSet)
		Vue.set(state, 'nestedDirectory', nestedDirectory)
	},

	// to assign the given directory from the database to the store
	setDirectoryFromDatabase (state: object, directoryToBeSet: object[]) {
		Vue.set(state, 'directoryFromDatabase', directoryToBeSet)
	},

	// to assing the id of the clicked/selected entity
	assignClickedEntityFileId (state: { clickedEntityFileId: object }, fileId: string) {
		Vue.set(state, 'clickedEntityFileId', fileId)
	},

	// to assing the id of the clicked/selected entity (if new file --> id = '')
	assignClickedEntityId (state: { clickedEntityId: string }, id: string) {
		Vue.set(state, 'clickedEntityId', id)
	}
}

export const getters = {
	getDirectory: (state: { directory: object[] }) => {
		return state.directory
	},

	getClickedEntityFileId: (state: { clickedEntityFileId: object }) => {
		return state.clickedEntityFileId
	},

	getClickedEntityId: (state: { clickedEntityId: string }) => {
		return state.clickedEntityId
	},

	getDirectoryId: (state: { directoryId: number }) => {
		return state.directoryId
	},

	getDatabaseDirectory: (state: { directoryFromDatabase: object[] }) => {
		return state.directoryFromDatabase
	},

	getNestedDirectory: (state: { nestedDirectory: object[] }) => {
		return state.nestedDirectory
	}
}
