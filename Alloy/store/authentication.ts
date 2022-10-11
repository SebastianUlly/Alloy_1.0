import Vue from 'vue'

export const state = () => ({
	expirationTime: null,
	userName: '',
	permissionIds: []
})

export const mutations = {
	// function to set the tokeninfo to the store
	setTokenInfo (
		state: {
			expirationTime: number,
			userName: string
			permissionIds: string[]
		},
		tokenInfo: {
			exp: number,
			name: string,
			permissionIds: string[]
		}
	) {
		// setting the expirationtime of the token
		Vue.set(state, 'expirationTime', tokenInfo.exp)
		// setting the username
		Vue.set(state, 'userName', tokenInfo.name)
		// setting the username
		Vue.set(state, 'permissionIds', tokenInfo.permissionIds)
	},

	// function to reset the tokeninfo in the store
	resetTokenInfo (state: { expirationTime: number }) {
		Vue.set(state, 'expirationTime', null)
		Vue.set(state, 'userName', '')
	},

	checkPermission (state: { permissionIds: string[] }, permissionIdToCheck: string) {
		console.log(state.permissionIds.includes(permissionIdToCheck))
		return state.permissionIds.includes(permissionIdToCheck)
		// return true
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
