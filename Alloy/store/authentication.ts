import Vue from 'vue'

export const state = () => ({
	expirationTime: null,
	userName: ''
})

export const mutations = {
	// function to set the tokeninfo to the store
	setTokenInfo (
		state: {
			expirationTime: number,
			userName: string },
		tokenInfo: {
			exp: number,
			name: string
		}
	) {
		// setting the expirationtime of the token
		Vue.set(state, 'expirationTime', tokenInfo.exp)
		// setting the username
		Vue.set(state, 'userName', tokenInfo.name)
	},

	// function to reset the tokeninfo in the store
	resetTokenInfo (state: { expirationTime: number }) {
		Vue.set(state, 'expirationTime', null)
		Vue.set(state, 'userName', '')
	}
}

export const getters = {
	// getter to get the expirationtime of the token
	getExpirationTime (state: { expirationTime: number }) {
		return state.expirationTime
	},

	// getter to get the username
	getUserName (state: { userName: string }) {
		return state.userName
	}
}
