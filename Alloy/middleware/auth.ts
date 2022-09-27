import gql from 'graphql-tag'

export default async (ctx: { redirect: any, route: any}) => {
	// checking if the user is allowed to access this route | passing as argument the elementId in meta of this route
	console.log(isAuth(ctx.route.meta[0].permissionId, ctx.route.meta[0].userId, ctx))
	if (!await isAuth(ctx.route.meta[0].permissionId, ctx.route.meta[0].userId, ctx)) {
		// if the user is not allowed --> redirecting to the startpage
		return ctx.redirect('/')
	}
}

function isAuth (permissionId: string, userId: string, ctx) {
	// console.log(permissionId, userId)
		// checking if the elementId is in the array for the alloedElements
		if (permissionId) {
			ctx.app.apolloProvider.defaultClient.query({
				variables: {
					permissionId: permissionId,
					userId: userId
				},

				query: gql`
					query (
						$userId: String
						$permissionId: String
					) {
						askPermission (
							userId: $userId
							permissionId: $permissionId
						)
					}
				`
			}).then((data) => {
				console.log(data.data.askPermission)
				return data.data.askPermission
			}).catch((error) => {
				console.log({ error })
			})
		}
	// if the token doesn't exist at the moment when the function is called, or the elementId is not in the allowed-elements-array --> returning false
	return false
}
