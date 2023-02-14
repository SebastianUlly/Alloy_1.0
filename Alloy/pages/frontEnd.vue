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
import projektListe from '~/components/frontEnd/projektListe';
import subMenu from '~/components/frontEnd/subMenu';
import zeiterfassung from '~/components/frontEnd/KW';
import projectsummary from '~/components/frontEnd/ProjectSummary'

export default {
	data(){
		return{
			component: ''
		}
	},
    
	components: {
      	projektListe,
		subMenu,
		zeiterfassung,
		projectsummary
    },

	methods:{
		openComponent(component){
			this.component = component
		}
	}
};
</script>
