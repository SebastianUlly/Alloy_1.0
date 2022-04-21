import Vue from 'vue'

export const state = () => ({
	allowedElements: [],
	expirationTime: null,
	userName: ''
})

export const mutations = {
	// function to set the tokeninfo to the store
	setTokenInfo (
		state: {
			allowedElements: string[],
			expirationTime: number,
			userName: string },
		tokenInfo: {
			allowed_elements: string[],
			exp: number,
			username: string
		}
	) {
		// setting the allowedElements-array of the user
		Vue.set(state, 'allowedElements', tokenInfo.allowed_elements)
		// setting the expirationtime of the token
		Vue.set(state, 'expirationTime', tokenInfo.exp)
		// setting the username
		Vue.set(state, 'userName', tokenInfo.username)
	},

	// function to reset the tokeninfo in the store
	resetTokenInfo (state: { allowedElements: string[], expirationTime: number }) {
		Vue.set(state, 'allowedElements', [])
		Vue.set(state, 'expirationTime', null)
		Vue.set(state, 'userName', '')
	}
}

export const getters = {
	// getter to get the allowedElements-array
	getAllowedElements (state: { allowedElements: string[] }) {
		return state.allowedElements
	},

	// getter to get the expirationtime of the token
	getExpirationTime (state: { expirationTime: number }) {
		return state.expirationTime
	},

	// getter to get the username
	getUserName (state: { userName: string }) {
		return state.userName
	}
}
