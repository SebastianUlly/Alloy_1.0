import gql from 'graphql-tag'

const FileData = gql`
	query (
		$id: String
	) {
		queryFileData (
			id: $id
		) {
			data
		}
	}
`

export { FileData }
