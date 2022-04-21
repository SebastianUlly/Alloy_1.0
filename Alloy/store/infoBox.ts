import Vue from 'vue'

export const state = () => ({
	reset: false,
	saveTrigger: false,
	hasChangedArray: []
})

export const mutations = {
	resetData (state: { reset: boolean }) {
		state.reset = !state.reset
	},

	setSaveTrigger (state: { saveTrigger: boolean }) {
		state.saveTrigger = !state.saveTrigger
	},

	addToHasChangedArray (state: { hasChangedArray: { elementId: string, hasChanged: boolean }[] }, payload: { elementId: string, hasChanged: boolean}) {
		if (payload) {
			state.hasChangedArray.push(payload)
		}
	},

	setHasChangedPropertyOfElement (state: { hasChangedArray: { elementId: string, hasChanged: boolean }[] }, payload: { elementId: string, hasChanged: boolean}) {
		const copy = JSON.parse(JSON.stringify(state.hasChangedArray))
		const elementToEdit = copy.find(item => item.elementId === payload.elementId)
		if (elementToEdit) {
			elementToEdit.hasChanged = payload.hasChanged
		}
		Vue.set(state, 'hasChangedArray', copy)
	},

	resetHasChangedArray (state: { hasChangedArray: { elementId: string, hasChanged: boolean } }) {
		Vue.set(state, 'hasChangedArray', [])
	}
}

export const getters = {
	getResetState (state: { reset: boolean }) {
		return state.reset
	},

	getSaveTrigger (state: { saveTrigger: boolean }) {
		return state.saveTrigger
	},

	getHasChangedArray (state: { hasChangedArray: { elementId: string, hasChanged: boolean }[] }) {
		return state.hasChangedArray
	}
}
