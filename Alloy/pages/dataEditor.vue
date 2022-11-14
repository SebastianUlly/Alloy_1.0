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
	}
}
</script>

<style>

</style>
