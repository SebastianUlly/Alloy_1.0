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
    }
};
</script>
