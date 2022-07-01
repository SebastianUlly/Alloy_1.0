import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const state = () => ({
	schemaId: '',
	schemaLabel: '',
	schemaMetadata: [],
	schemaElements: [],
	schemaLayout: []
})

export const mutations = {
	setNewSchema (
		state: {
			schemaId: string,
			schemaLabel: string,
			schemaMetadata: object[],
			schemaElements: object[],
			schemaLayout: object[]
		}
	) {
		Vue.set(state, 'schemaId', uuidv4())
		Vue.set(state, 'schemaLabel', '')
		Vue.set(state, 'schemaMetadata', [])
		Vue.set(state, 'schemaElements', [])
		Vue.set(state, 'schemaLayout', [])
	},

	setSchemaId (
		state: {
			schemaId: string
		},
		schemaId: string,
	) {
		Vue.set(state, 'schemaId', schemaId)
	},

	setSchemaLabel (
		state: {
			schemaLabel: string
		},
		schemaLabel: string
	) {
		Vue.set(state, 'schemaLabel', schemaLabel)
	},

	setSchemaMetadata (
		state: {
			schemaMetadata: object[],
		},
		schemaMetadata: object[]
	) {
		Vue.set(state, 'schemaMetadata', schemaMetadata)
	},

	setSchemaElements(
		state: {
			schemaElements: object[]
		},
		schemaElements: object[]
	) {
		Vue.set(state, 'schemaElements', schemaElements)
	},

	setSchemaLayout (
		state: {
			schemaLayout: object[]
		},
		schemaLayout: object[]
	) {
		Vue.set(state, 'schemaLayout', schemaLayout)
	}
}

export const getters = {
	getSchema (
		state: {
			schemaId: string,
			schemaLabel: string,
			schemaMetadata: object[],
			schemaElements: object[],
			schemaLayout: object[]
		}
	) {
		return state
	},

	getSchemaId (
		state: {
			schemaId: string
		}
	) {
		return state.schemaId
	}
}
