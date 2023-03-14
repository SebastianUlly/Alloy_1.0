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
import gql from "graphql-tag";
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
	created () {
		this.getProjects()
	},
	methods:{
		openComponent(component){
			this.component = component
			this.$store.commit('file/resetEnteredData')
		},
		async getProjects () {
			const projects = await this.$apollo.query({
				query: gql`
					query {
						files_v2{
							id
							label
							data
							schemaId
						}
					}
				`
			})
			this.$store.commit('file/setProjectList', projects.data.files_v2)
		}
	}
};
</script>
