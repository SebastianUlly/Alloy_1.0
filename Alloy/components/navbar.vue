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
		<v-btn
			v-if="checkPermissionIdsHere('3fde6c2c-0867-4aba-9442-f4eeccf467ff')"
			text
			to="/schemaEditor"
		>
			Schema Editor
		</v-btn>
		<v-btn
			v-if="checkPermissionIdsHere('435b48cc-5a55-4980-9880-73e7f40f5471')"
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

// import { checkPermission } from '~/assets/functions/permission'
import { checkPermissionId } from '~/assets/functions/permission'

export default {
	computed: {
		...mapGetters({
			tokenExpirationTime: 'authentication/getExpirationTime',
			permissions: 'authentication/getPermissionIds'
		}),

		
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

		checkPermissionIdsHere (arg) {
			if (this.permissions) {
				return checkPermissionId(this.permissions, arg)
			}
			return false
		}
	},
}
</script>

<style>
#navbar {
	max-height: 55px;
}
</style>
