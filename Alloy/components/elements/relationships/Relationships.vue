<template>
	<div>
		<div v-for="(element, key) of childElements" :key="element.elementId">
			<h4>
				{{ element.label }}
			</h4>
			<component
				:is="element.componentId"
				:element-id="element.elementId"
				:relationships-from-database="relationshipsFromDatabase"
				:label="element.label"
				:parameters="element.parameters"
			/>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag'

import { mapGetters } from 'vuex'
import Relationship from './Relationship.vue'

export default {
	props: {
		elementId: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		hasError: {
			type: Boolean,
			default: false
		}
	},

	components: {
		Relationship
	},

	data () {
		return {
			childElements: [],
			relationshipsFromDatabase: []
		}
	},

	computed: {
		...mapGetters({
			fileValues: 'file/getFileValues',
			schemaElements: 'schema/getSchemaElements',
			relationships: 'relationship/getRelationships',
			relationshipsToDelete: 'relationship/getRelationshipsToDelete',
			saveTrigger: 'infoBox/getSaveTrigger'
		}),

		watchFileId () {
			return this.fileValues.id
		},

		watchSchemaElements () {
			return this.schemaElements
		},

		watchSaveTrigger () {
			return this.saveTrigger
		}
	},

	watch: {
		watchFileId () {
			this.getRelationships()
		},

		watchSchemaElements: {
			deep: true,
			handler () {
				this.getChildElements()
			}
		},

		watchSaveTrigger () {
			this.saveRelationships()
		}
	},

	mounted () {
		this.getRelationships()
		this.getChildElements()
	},

	methods: {
		getChildElements () {
			this.childElements = []
			for (const element of this.schemaElements) {
				if (element.parentId === this.elementId) {
					this.childElements.push(element)
				}
			}
		},

		getRelationships () {
			this.$store.commit('relationship/resetRelationships')
			this.relationshipsFromDatabase = []
			if (this.fileValues.id) {
				this.$apollo.query({
					variables: {
						fileId: this.fileValues.id
					},

					query: gql`
						query (
							$fileId: String
						) {
							relationshipsToFileId (
								fileId: $fileId
							) {
								relationshipId
								fileId
								position
								elementId
							}
						}
					`
				}).then((data) => {
					this.relationshipsFromDatabase = data.data.relationshipsToFileId
				}).catch((error) => {
					console.log({ error })
				})
			}
		},

		saveRelationships () {
			this.$apollo.mutate({
				variables: {
					data: this.relationships
				},

				mutation: gql`
					mutation (
						$data: JSON
					) {
						saveRelationships (
							data: $data
						) 
					}
				`
			}).then((data) => {
				// console.log(data)
				this.deleteRelationships()
			}).catch((error) => {
				console.log({ error })
			})
		},

		deleteRelationships () {
			this.$apollo.mutate({
				variables: {
					data: this.relationshipsToDelete
				},

				mutation: gql`
					mutation (
						$data: JSON
					) {
						deleteRelationships (
							data: $data
						)
					}
				`
			}).then((data) => {
				// console.log(data)
				this.$store.commit('relationship/resetRelationshipsToDelete')
			}).catch((error) => {
				console.log({ error })
			})
		}
	}
}
</script>
