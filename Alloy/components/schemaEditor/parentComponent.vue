<template>
	<v-card class="container">
		<button @click="newSchema()">
			Neues Schema
		</button>
		{{ schemaId }}
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters({
			schemaId: 'schemaEditor/getSchemaId',
			schemaFromStore: 'schemaEditor/getSchema'
		})
	},

	methods: {
		newSchema () {
			this.$store.commit('schemaEditor/setNewSchema')
		}
	},
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 500px;
}
</style>