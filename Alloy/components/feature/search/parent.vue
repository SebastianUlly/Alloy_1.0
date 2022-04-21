<template>
	<div>
		<!-- search-component -->
		<search
			@search="search"
		/>
		<!-- component to display the search-result -->
		<searchresults
			v-if="searchResult"
			:schema="schema"
			:search-result="searchResult"
		/>
	</div>
</template>

<script>
import gql from 'graphql-tag'
import search from './search.vue'
import searchresults from './searchresults..vue'

export default {
	// graphql-queries that are called when the component is called
	apollo: {
		schema: gql`
			query Schemes {
				schema {
					id
					label
					metadata
					elements
				}
			} 
		`
	},

	components: {
		search,
		searchresults
	},

	data () {
		return {
			searchResult: null
		}
	},

	methods: {
		// function to send the search-request to the back-end
		// is triggered when the search-component passes a searchValue back
		search (searchValue) {
			// checking if the searchValue isn't empty
			if (searchValue) {
				// apollo query
				this.$apollo.query({
					variables: {
						searchValue
					},

					query: gql`
						query (
							$searchValue: String
						) {
							searchQuery (
								searchValue: $searchValue
							) {
								fileId
								fileLabel
								fileData
								schemaId
								searchvalue
								weight
							}
						}
					`
				}).then((data) => {
					// assigning the results to this.searchResult
					this.searchResult = data.data.searchQuery
				}).catch((error) => {
					console.log({ error })
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
