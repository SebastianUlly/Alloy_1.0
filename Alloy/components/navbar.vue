<template>
	<v-app-bar id="navbar">
		<!-- button to navigate to the startpage -->
		<v-btn
			v-if="checkPermissionIdsHere('a78f9e4e-6915-4418-843c-7730a23873f2')"
			text 
			to="/"
		>
			Home
		</v-btn>
		<!-- button to navigate to the dataEditor, but only if the logged in user is allowed to -->
		<!-- <v-btn
		    v-if="checkPermissionIdsHere('109659e7-d2a0-412a-a7a8-1d0823341a8e')"
			text
			to="/dataEditor"
		>
			Data Editor
		</v-btn> -->
		<v-btn
			text
			to="/dataEditor"
		>
			Data Editor
		</v-btn>
		<!-- <v-btn
			v-if="checkPermissionIdsHere('3fde6c2c-0867-4aba-9442-f4eeccf467ff')"
			text
			to="/schemaEditor"
		>
			Schema Editor
		</v-btn> -->
		<v-btn
			v-if="checkPermissionIdsHere('f4c526cb-95af-44db-8902-81bc7bcc9059')"
			text
			to="/frontEnd"
		>
			Front End
		</v-btn>
		<!-- <v-btn
			v-if="checkPermissionIdsHere('3b998b2c-7095-47c3-9d95-3726cf892de5')"
			text
			to="/permissionEditor"
		>
			Permission Editor
		</v-btn> -->
		<v-spacer />
			{{userName}}
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
			permissions: 'authentication/getPermissionIds',
			userName: 'authentication/getUserName'
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
