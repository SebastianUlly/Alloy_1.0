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
import zeiterfassung from '~/components/frontEnd/TimeParent';
import projectsummary from '~/components/frontEnd/ProjectSummary'
import externBills from '~/components/frontEnd/externBills'

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
		projectsummary,
		externBills
    },

	methods:{
		openComponent(component){
			this.component = component
			this.$store.commit('file/resetEnteredData')
		}
	}
};
</script>
