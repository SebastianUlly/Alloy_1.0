import Vue from 'vue'

export const state = () => ({
	permissionIds: [],
	expirationTime: null,
	userId: ''
})

export const mutations = {
	// function to set the tokeninfo to the store
	setTokenInfo (
		state: {
			permissionIds: string[],
			expirationTime: number,
			userId: string },
		tokenInfo: {
			permissionIds: string[],
			exp: number,
			userId: string
		}
	) {
		// setting the permissionIds-array of the user
		Vue.set(state, 'permissionIds', tokenInfo.permissionIds)
		// setting the expirationtime of the token
		Vue.set(state, 'expirationTime', tokenInfo.exp)
		// setting the userId
		Vue.set(state, 'userId', tokenInfo.userId)
	},

	// function to reset the tokeninfo in the store
	resetTokenInfo (state: { permissionIds: string[], expirationTime: number }) {
		Vue.set(state, 'permissionIds', [])
		Vue.set(state, 'expirationTime', null)
		Vue.set(state, 'userId', '')
	}
}

export const getters = {
	// getter to get the permissionIds-array
	getPermissionIds (state: { permissionIds: string[] }) {
		return state.permissionIds
	},

	checkPermissionId: (state: { permissionIds: string[] }) => (permissionIdToCheck: string) => {
		return state.permissionIds.includes(permissionIdToCheck)
	},

	// // getter to get the expirationtime of the token
	// getExpirationTime (state: { expirationTime: number }) {
	// 	return state.expirationTime
	// },

	// getter to get the userId
	getUserId (state: { userId: string }) {
		return state.userId
	}
}
