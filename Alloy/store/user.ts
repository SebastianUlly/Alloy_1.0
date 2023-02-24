import Vue from 'vue'

export const state = () => ({
	timeSummary: null
})

export const mutations = {
	setTimeSummary (
		state: {
			timeSummary: Object
		}
	) {

	}
}

export const getters = {
	getTimeSummary (
		state: {
			timeSummary: Object
		}
	) {
		return state.timeSummary
	}
}