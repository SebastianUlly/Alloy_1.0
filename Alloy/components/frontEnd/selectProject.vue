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
                {{ item.label }} - {{item.pharmacy}} - {{ item.name }}
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
            selectedProjectId: '',
            pharmacyAbb:{}
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
        sortListByNumber(){
            this.projectList.sort((a, b) => parseInt(b.label) - parseInt(a.label))
        },
        async getPharmacyAbb(pharmacyId){
			if(!this.pharmacyAbb[pharmacyId]){
				this.pharmacyAbb[pharmacyId]=(
				await this.$apollo.query({
					variables: {
							id: pharmacyId
						},
					query: gql`
						query ($id: String){
							queryFileData(id: $id){
								id
								label
								data
							}
						}
					`
				}))
			}
			return this.pharmacyAbb[pharmacyId]
		},
        selectProject(){
            this.$emit('sendSelectedProject', this.selectedProjectId)
        },
        async createProjectList(){
            this.projectList = [];
            for(let project of this.fileBySchemaId){
                //the function gives back the pharmacy data by the pharmacyId
                let temp = await this.getPharmacyAbb(project.data.find(item => item.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text)
                if(project.data.find(item => item.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d").data.text == this.sendYearToSelectProject){
                    let item = {
                        id: project.id,
                        label: project.label,
                        pharmacy: temp.data.queryFileData.data[0].data.text,
                        name: project.data.find(item => item.elementId == "5187f38c-c1b7-4f8e-9c00-b87f703650ee").data.text,
                        year: project.data.find(item => item.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d").data.text
                    }
                    this.projectList.push(item);
                }
            }
            this.sortListByNumber()
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