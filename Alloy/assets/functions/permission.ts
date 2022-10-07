export function checkPermission (
	ctx: object,
	permissionId: String
) {
	// ctx.apollo.query({
	// 	variables: {
	// 		permissionId
	// 	},

	// 	query: gql`
	// 		query (
	// 			$permissionId: String
	// 		) {
	// 			checkPermission (
	// 				permissionId: $permissionId
	// 			) {
	// 				value
	// 			}
	// 		}
	// 	`
	// }).then((data) => {
	// 	console.log(data)
	// }).catch((error) => {
	// 	console.log({ error })
	// })
}