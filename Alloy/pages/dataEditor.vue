<template>
	<v-app>
		<v-row v-if="files && schema">
			<v-col>
				<Container :files="files" :schema="schema" />
			</v-col>
			<v-col>
				<InfoBox :schema="schema" />
			</v-col>
		</v-row>
	</v-app>
</template>

<script>
import gql from 'graphql-tag'
import Cookie from 'js-cookie'

import Container from '~/components/container'
import InfoBox from '~/components/fileDisplay/infoBox'

export default {
	// graphql-queries that are called when the component is called
	apollo: {
		// query to get the files of the directory (SUL)
		files: gql`
			query Files {
				files {
					fileId: id
					label
					schemaId
				}
			}
		`,

		schema: gql`
			query Schemes {
				schema {
					id
					label
					metadata
				}
			} 
		`
	},

	components: {
		Container,
		InfoBox
	},

	created () {
		this.getToken()
	},

	methods: {
		getToken () {
			const token = Cookie.get('apollo-token')
			// if a token is found
			if (token) {
				// extracting the encoded payload from the token
				const base64Url = token.split('.')[1]
				// replacing characters in the encoded payload
				const base64 = base64Url.replace('-', '+').replace('_', '/')
				// decoding and parsing the payload into a JSON-object
				const payload = JSON.parse(window.atob(base64))

				console.log(payload)

				// coomiting the payload to the store
				this.$store.commit('authentication/setTokenInfo', payload)
			}
		}
	}
}
</script>

<style>

</style>
