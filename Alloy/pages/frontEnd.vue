<template>
	<div>
		<subMenu @sendComponentToFrontEnd="openComponent($event)" />
		<div class="leftSection">
			<component
			v-if="component"
			:is="component"
			/>
		</div>
	</div>
</template>
<script>
import projektListe from "~/components/frontEnd/projektListe";
import subMenu from "~/components/frontEnd/subMenu";
export default {
	data(){
		return{
			component: "projektListe"
		}
	},
    components: {
      	projektListe,
		subMenu
    },
	methods:{
		openComponent(component){
			this.component = component
		}
	}
};
</script>
