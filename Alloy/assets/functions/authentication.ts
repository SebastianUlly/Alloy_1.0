import gql from 'graphql-tag'


// export function checkPermissionId (permissionObject, permissionId, id) {
// 	this.$apollo.query({
// 		variables: {
// 			permissionId: permissionId,
// 			userId: '8eef4df3-2670-470e-9a54-c23607f25fad'
// 		},

// 		query: gql`
// 			query (
// 				$userId: String
// 				$permissionId: String
// 			) {
// 				askPermission (
// 					userId: $userId
// 					permissionId: $permissionId
// 				)
// 			}
// 		`
// 	}).then((data) => {
// 		permissionObject[id].permitted = data.data.askPermission
// 		return data.data.askPermission
// 	}).catch((error) => {
// 		console.log({ error })
// 	})
// }