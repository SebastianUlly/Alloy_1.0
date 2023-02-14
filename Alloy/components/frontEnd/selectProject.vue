<template>
    <div class="selectProjectBackground">
        <select class="selectProject" name="" id="" @change="selectProject()" v-model="selectedProjectId">
            <option selected hidden disabled>Projekt auswählen</option>
            <option 
                class="selectProjectOption"
                v-for="item in projectList"
                :value="item.id"
                :key="item.id"
            >
                {{ item.label }} - {{ item.name }}
            </option>
        </select>
    </div>
</template>
<script>

import gql from "graphql-tag";
export default{
    props:{
        sendYearToSelectProject:{
            type: String
        }
    },
    data(){
        return  {
            projectList: [],
            selectedProjectId: ''
        }
    },
    apollo: {
        fileBySchemaId: gql `
			query Files {
				fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					label
					data
					id
				}
			}
		`,
    },
    methods:{
        selectProject(){
            this.$emit('sendSelectedProject', this.selectedProjectId)
        },
        createProjectList(){
            this.projectList = [];
            for(let project of this.fileBySchemaId){
                if(project.data.find(item => item.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d").data.text == this.sendYearToSelectProject){
                    let item = {
                        id: project.id,
                        label: project.label,
                        name: project.data.find(item => item.elementId == "5187f38c-c1b7-4f8e-9c00-b87f703650ee").data.text,
                        year: project.data.find(item => item.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d").data.text
                    }
                    this.projectList.push(item);
                } 
            }
            
        }
    },
    watch:{
        fileBySchemaId: {
            deep: true,
            handler () {
                this.createProjectList();
            }
        },
        sendYearToSelectProject:{
            handler (){
                this.createProjectList(this.sendYearToSelectProject);
            }
        }
    }



}
</script>

<style scoped>
.selectProjectBackground {
	background-color: #1E1E1E;
	height: 50px;
	width: auto;
	display: flex;
    align-items: center;
    justify-content: center;
	border-radius: 2px;
}

.selectProject {
	border: solid 1px white;
	border-radius: 4px;
	width: 96%;
	height: 70%;
	color: white;
    text-align: left;
	padding-left: 20px;
}
.selectProjectOption {
	background-color: #1E1E1E;
}
</style>