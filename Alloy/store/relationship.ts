import Vue from 'vue'

export const state = () => ({
	relationshipArray: [],
	relationshipsToDelete: []
})

export const mutations = {
	setRelationships (state: object, relationshipsToSet: object[]) {
		Vue.set(state, 'relationshipArray', relationshipsToSet)
	},

	resetRelationships (state: object) {
		Vue.set(state, 'relationshipArray', [])
	},

	updateElementInRelationships (state: { relationshipArray: { relationshipId: string, fileId: string, elementId: string }[] }, relationship: { relationshipId: string, fileId: string, elementId: string }) {
		console.log('store', relationship)
		for (const item of state.relationshipArray) {
			if (item.relationshipId === relationship.relationshipId && item.fileId === relationship.fileId && item.elementId === relationship.elementId) {
				const indexOfRelationship = state.relationshipArray.indexOf(item)
				state.relationshipArray[indexOfRelationship] = relationship
			}
		}
	},

	addRelationships (state: { relationshipArray: object[] }, relationships: object[]) {
		for (const element of relationships) {
			state.relationshipArray.push(element)
		}
	},

	deleteRelationships (state: { relationshipArray: { relationshipId: string }[], relationshipsToDelete: string[] }, relationshipId: string) {
		state.relationshipsToDelete.push(relationshipId)
		const relationshipArrayWithRemovedRelatiionships = state.relationshipArray.filter(item => item.relationshipId !== relationshipId)
		Vue.set(state, 'relationshipArray', relationshipArrayWithRemovedRelatiionships)
	},

	resetRelationshipsToDelete (state: { relationshipsToDelete: string[] }) {
		Vue.set(state, 'relationshipsToDelete', [])
	}
}

export const getters = {
	getRelationships (state: { relationshipArray: object [] }) {
		return state.relationshipArray
	},

	getRelationshipsToDelete (state: { relationshipsToDelete: string[] }) {
		return state.relationshipsToDelete
	}
}
