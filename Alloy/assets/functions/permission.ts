import gql from 'graphql-tag'

export async function  checkPermission (
	apollo: any,
	permissionId: String
) {
	await apollo.defaultClient.query({
		variables: {
			permissionId
		},

		query: gql`
			query (
				$permissionId: String
			) {
				checkPerimssionId (
					permissionId: $permissionId
				)
			}
		`
	}).then((data) => {
		console.log(data.data.checkPerimssionId)
		return data.data.checkPerimssionId
		
	}).catch((error) => {
		console.log({ error })
		return false
	})
}