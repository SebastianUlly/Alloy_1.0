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
			text
			to="/schemaEditor"
		>
			Schema Editor
		</v-btn>
		<!-- spacer to create space between the vnav buttons and the login/logout buttons as well user info -->
		<v-spacer />
		<!-- div-element that is rendered if a user is logged in (if a userId exists) -->
		<div v-if="userId">
			<!-- account-icon -->
			<v-icon>
				mdi-account
			</v-icon>
			<!-- userId -->
			{{ userId }}
			<!-- logout button, when clicked triggers logout function -->
			<v-btn
				@click="logout()"
			>
				Logout
			</v-btn>
		</div>
		<!-- div-element that is rendered is no user is logged in -->
		<div v-else>
			<!-- button that navigates to the login page -->
			<v-btn
				text
				to="/authenticate"
			>
				Login
			</v-btn>
		</div>
	</v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookie from 'js-cookie'

export default {
	computed: {
		...mapGetters({
			permissionIds: 'authentication/getPermissionIds',
			userId: 'authentication/getUserId'
		})
	},

	// when the navbar is mounted --> looking for a token
	mounted () {
		// getting the token from the cookies
		const token = Cookie.get('apollo-token')
		// if a token is found
		if (token) {
			// extracting the encoded payload from the token
			const base64Url = token.split('.')[1]
			// replacing characters in the encoded payload
			const base64 = base64Url.replace('-', '+').replace('_', '/')
			// decoding and parsing the payload into a JSON-object
			const payload = JSON.parse(window.atob(base64))

			// coomiting the payload to the store
			this.$store.commit('authentication/setTokenInfo', payload)
		}
	},

	methods: {
		// method that is called when the logout button is clicked
		logout () {
			// destroying the token in the cookies
			this.$apolloHelpers.onLogout()
			// resetting the info from the token in the store
			this.$store.commit('authentication/resetTokenInfo')
			// redirecting the client to the startpage
			this.$router.push('/')
		}
	}
}
</script>

<style>
#navbar {
	max-height: 55px;
}
</style>
