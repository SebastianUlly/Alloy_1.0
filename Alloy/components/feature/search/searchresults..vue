<template>
	<div class="main">
		ERGEBNISSE
		<div v-if="searchResult">
			<div v-for="(item, index) in searchResult" :key="index">
				<searchresult
					:search-item="item"
				/>
			</div>
		</div>
		<div v-else>
			Es konnten keine Ergebnisse zu [] gefunden werden.
		</div>
	</div>
</template>

<script>
// uncomment if used in webshop
// import { mapGetters } from 'vuex'

import searchresult from './searchresult.vue'

export default {
	components: { searchresult },
	props: {
		// comment if used in webshop
		schema: {
			type: Array,
			required: true
		},
		searchResult: {
			type: Array,
			required: true
		}
	}
}
</script>

<style lang="scss" scoped>

.main {
	margin: 200px 0 0 0;
}

input {
	background-color: white;
	border: 2px solid black;
}
</style>
