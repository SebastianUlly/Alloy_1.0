import Vue from 'vue'

export const state = () => ({
	expirationTime: null,
	userName: '',
	permissionIds: [],
	id: '',
	userMeta:{}
})

export const mutations = {
	// function to set the tokeninfo to the store
	setTokenInfo (
		state: {
			expirationTime: number,
			userName: string
			id: string,
			permissionIds: string[],
			userMeta: object
		},
		tokenInfo: {
			exp: number,
			name: string,
			id: string,
			permissionIds: string[]
			userMeta: object
		}
	) {
		console.log(tokenInfo)
		// setting the expirationtime of the token
		Vue.set(state, 'expirationTime', tokenInfo.exp)
		// setting the username
		Vue.set(state, 'userName', tokenInfo.name)
		// setting the userPermissionIds
		Vue.set(state, 'permissionIds', tokenInfo.permissionIds)
		// setting the userId
		Vue.set(state, 'id', tokenInfo.id)
		//setting the user metadata (name, weekly hours)
		Vue.set(state, 'userMeta', tokenInfo.userMeta)
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
	},

	getPermissionIds (state: { permissionIds: string[] }) {
		return state.permissionIds
	},

	getUserId (state: { id: string }) {
		return state.id
	},
	getUserMeta (state: {userMeta: object}){
		return state.userMeta
	}
}
