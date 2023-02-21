<template>
	<div class="leftSection">
		<div class="topSection">
			<selectYear @sendYear="getYear"/>
			<h1>-</h1>
			<selectProject 
				:sendYearToSelectProject="sendYearToSelectProject"
				@sendSelectedProject="getSelectedProjectId"
			/>
			<search @sendValue="getSearchValue" />
		</div>
		<singleProjectView
			:selectedProjectId="selectedProjectId"
		/>
		<projectTimeTable
			:selectedProjectId="selectedProjectId"
			:searchValue="searchValue"
		/>
	</div>
</template>

<script>
import singleProjectView from "~/components/frontEnd/singleProjectView";
import selectYear from "~/components/frontEnd/selectYear";
import selectProject from "~/components/frontEnd/selectProject";
import projectTimeTable from '~/components/frontEnd/projectTimeTable';
import search from "~/components/frontEnd/search";
export default {
	components:{
		selectYear,
		selectProject,
		singleProjectView,
		projectTimeTable,
		search
	},
	data(){
		return{
			sendYearToSelectProject: '2023',
			selectedProjectId: '',
			projectTimeTable: false,
			searchValue: ''
		}
	},
	methods:{
		getYear(year){
			this.sendYearToSelectProject = year
		}, 
		getSelectedProjectId(id){
			this.selectedProjectId = id
			this.projectTimeTable = true
		},
		getSearchValue(searchValue){
			this.searchValue = searchValue
		}
	}
}
</script>


<style scoped>
.leftSection{
	max-width: 900px;
}
.topSection{
	margin: 30px 0;

	display: flex;
	align-items: center;
	justify-content: flex-start;
}

</style>