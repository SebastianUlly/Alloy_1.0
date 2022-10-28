<template>
	<div>
		<h1>Permission Editor</h1>
		<hr>
		<v-treeview :items="items"></v-treeview>
	</div>
</template>
<script>
import Cookie from 'js-cookie'
import permissionTree from '~/assets/classes/treeViewArray.js'
export default {
	data(){
		return{
			items:[],
			selection: [],
		}
	},
	async created() {
		this.getToken()
		this.items = await permissionTree(this.$apollo)
	},

	methods: {
		getToken () {
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
		}
	}
};
</script>
<style>

</style>