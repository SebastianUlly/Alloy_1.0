import Vue from 'vue'
import gql from 'graphql-tag'

export const state = () => ({
	schemaRelationships: null
})

export const mutations = {
	setSchemaRelationships (state: { schemaRelationships: object[] }, payload) {
		Vue.set(state, 'schemaRelationships', payload)
	}
}

export const actions = {
	async nuxtServerInit ({ commit }, ctx) {
		const result = await ctx.app.apolloProvider.defaultClient.query({
			query: gql`
				query {
					schemaRelationships {
						id
						relationship
					}
				}
			`
		}).then((data) => {
			return data.data.schemaRelationships
		}).catch((error) => {
			console.log({ error })
		})

		commit('setSchemaRelationships', result)
	}
}

export const getters = {
	getSchemaRelationships (state: { schemaRelationships: object[] }) {
		return state.schemaRelationships
	}
}
