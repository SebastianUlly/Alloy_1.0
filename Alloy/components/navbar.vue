<template>
	<v-app-bar id="navbar">
		<!-- button to navigate to the startpage -->
		<v-btn text to="/">
			Home
		</v-btn>
		<!-- button to navigate to the dataEditor, but only if the logged in user is allowed to -->
		<v-btn
			text
			to="/dataEditor"
		>
			Data Editor
		</v-btn>
		<!-- button to navigate to the schemaEditor, but only if the logged in user is allowed to -->
		<v-btn
			v-if="checkPermission('89f18d53-9495-45a1-bf8f-4ed66358a687')"
			text
			to="/schemaEditor"
		>
			Schema Editor
		</v-btn>
		{{ checkPermission('bae13b03-d59f-48b7-8cdf-0eb502e333b6') }}
		<v-btn
			v-if="checkPermission('bae13b03-d59f-48b7-8cdf-0eb502e333b6')"
			text
			to="/frontEnd"
		>
			Front End
		</v-btn>
		<v-spacer />
		<v-btn
			v-if="tokenExpirationTime && tokenExpirationTime*1000 > (new Date()).getTime()"
			text
			@click="logout"
		>
			Logout
		</v-btn>
		<v-btn
			v-else
			text
			to="/login"
		>
			Login
		</v-btn>
	</v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'

// import { checkPermission } from '~/assets/functions/permission'

export default {
	computed: {
		...mapGetters({
			tokenExpirationTime: 'authentication/getExpirationTime'
		})
	},

	methods: {
		logout () {
			// destroying the token in the cookies
			this.$apolloHelpers.onLogout()
			// resetting the info from the token in the store
			this.$store.commit('authentication/resetTokenInfo')
			// redirecting the client to the startpage
			this.$router.push('/')
		},

		checkPermission (permissionId) {
			let result
			this.$apollo.query({
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
				console.log('permission-boolean: ', data.data.checkPerimssionId)
				result = data.data.checkPerimssionId
			}).catch((error) => {
				console.log({ error })
			})
			return result
		}
	},
}
</script>

<style>
#navbar {
	max-height: 55px;
}
</style>
