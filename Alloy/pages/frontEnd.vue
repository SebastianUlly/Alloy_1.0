<template>
	<div class="background">
		<div class="leftSection">
			<projektListe />
		</div>
	</div>
</template>
<script>
import projektListe from "~/components/frontEnd/projektListe";
import Cookie from 'js-cookie'
import Vue from 'vue'
Vue.prototype.$hostname = 'your variable name'
export default {
    components: {
      	projektListe
    },

	created () {
		this.getToken()
		
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

				// console.log(payload)
				
				// coomiting the payload to the store
				this.$store.commit('authentication/setTokenInfo', payload)
			}
		}
	}
};
</script>
