import Vue from 'vue'

export const state = () => ({
	values: {},
	metadata: [],
	elements: []
})

export const mutations = {
	setSchema (
		state: object,
		schemaData: {
			id: number,
			label: string,
			metadata: {
				isLeaf: boolean,
				metadata_elements: object[]
			},
			elements: object[]
		}
	) {
		const values = {
			id: schemaData.id,
			label: schemaData.label,
			isLeaf: schemaData.metadata.isLeaf
		}
		Vue.set(state, 'values', values)
		Vue.set(state, 'metadata', schemaData.metadata.metadata_elements)
		Vue.set(state, 'elements', schemaData.elements)
	}
}

export const getters = {
	getSchemaValues (state: { values: object }) {
		return state.values
	},

	getSchemaMetadata (state: { metadata: object[] }) {
		return state.metadata
	},

	getSchemaElements (state: { elements: object[] }) {
		return state.elements
	}
}
