<template>
	<div>
		<h2>
			Login
		</h2>
		<br>
		Username:
		<!-- input for the emailaddress -->
		<v-text-field
			v-model="username"
			placeholder="Username"
		/>
		<br>
		Passwort:
		<!-- input for the password -->
		<v-text-field
			v-model="password"
			placeholder="Password"
		/>
		<br>
		<br>
		<!-- button that triggers the login-function -->
		<v-btn @click="login()">
			Login
		</v-btn>
	</div>
</template>

<script>
import gql from 'graphql-tag'
import Cookie from 'js-cookie'

export default {
	data () {
		return {
			username: '',
			password: ''
		}
	},

	methods: {
		// function that is called when the login-button is clicked
		login () {
			this.$apollo.mutate({
				variables: {
					username: this.username,
					password: this.password
				},

				mutation: gql`
					mutation (
						$username: String
						$password: String
					) {
						login (
							username: $username
							password: $password
						) {
							token
						}
					}
				`
			}).then((data) => {
				// saving the token of the successful request to the cookies under the name 'apollo-token'
				this.$apolloHelpers.onLogin(data.data.login.token)

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

					console.log(payload)

					// coomiting the payload to the store
					this.$store.commit('authentication/setTokenInfo', payload)
				}

				// after login --> redirecting the user to the startpage
				this.$router.push('/')
			}).catch((error) => {
				console.log({ error })
			})
		}
	}
}
</script>