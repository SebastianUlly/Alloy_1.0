<template>
    <div>
        <popUp
            v-if="popUp && popUpSchema"
            @closeNewProject="openNewProject($event)"
            @saveSuccess="projectSaved"
            :popUpSchema = "popUpSchema"
            :clickedFile = "clickedFile"
        />
        <v-progress-linear
            v-if="loading"
            indeterminate 
            color="green"
        ></v-progress-linear>
        <div class="singleProjectBackground">
            <div v-if="!selectedProjectId">
                Kein Projekt ausgewählt
            </div>
            <div v-if="selectedProjectId">
                {{ project.year }} - {{ project.label }} - {{ project.name }} - {{ project.pharmacyAbb }} - {{ project.status }}
            </div>
            <v-btn @click="openEditProject" :loading="popUpLoading">
                <v-icon>
                    mdi-pencil-outline
                </v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import gql from "graphql-tag";
import popUp from "~/components/frontEnd/lib/popUp";
import { mergeSchemas } from '~/assets/classes/objectClasses'

export default{
    components:{
        popUp
    },
    props:{
        selectedProjectId:{
            type: String
        }
    },
    data(){
        return{
            project: {},
            loading: false,
            popUp: false,
            popUpSchema: {},
            clickedFile: "",
            popUpSchema: null,
			ids:["ca78b111-d1f0-4b4b-b82c-c7e727804b0b", "77ffa6dc-8676-4ee3-acae-d12697f608a1"],
            popUpLoading: false,
            pharmacyById: {}
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
        async getPharmacyById(id){
			if(this.pharmacyById[id]){
				return this.pharmacyById[id]
			} else {
				this.pharmacyById[id] = (
					await this.$apollo.query({
						variables: {
							pharmacyId : id
						},
						query: gql `
							query (
								$pharmacyId: String
							) {
								queryFileData (
									id: $pharmacyId
								) {
									id
									label
									data
								}
							}
						`
					})
				).data.queryFileData
				return this.pharmacyById[id]
			}
		},
        openNewProject(value){
			this.popUpLoading = true
			this.$store.commit("file/resetEnteredData")
			this.clickedFile = null;
			this.popUp = value;
			this.getDataForPopUp(["ca78b111-d1f0-4b4b-b82c-c7e727804b0b"]);
		},
        projectSaved () {
            this.$apollo.queries.fileBySchemaId.refetch()
            this.getProjectById(this.selectedProjectId)
			this.popUp = false
		},
        openEditProject(){
            this.popUpLoading = true
            this.clickedFile = this.project.id;
			this.getDataForPopUp(["ca78b111-d1f0-4b4b-b82c-c7e727804b0b", "77ffa6dc-8676-4ee3-acae-d12697f608a1"]);
			this.popUp = true;
		},
        async getDataForPopUp(id){
			let schemas = [];
			// this.popUpSchema has to empty every time a new schema has to be loaded
			this.popUpSchema = null;
			//query the both schema
			for(const item of id){
				await this.$apollo.query({
					variables:{
						id: item
					},
					query: gql`
						query($id: String){
							querySchemaById( id: $id){
								id
								label
								metadata
								elements
							}
						}
					`
				}).then((data) => {
					//if both schemas are loaded, sending them to the mergeSchemas function to merge
					schemas.push(data.data.querySchemaById)
					if(id.length === schemas.length && id.length !== 1){
						this.popUpSchema = mergeSchemas(schemas[0], schemas[1]);
					}else if(id.length === 1){
						this.popUpSchema = data.data.querySchemaById;
					}
				})
			}
			this.popUpLoading = false
		},
        async getProjectById(projectId){
            this.loading = true
            const { data } = await this.$apollo.query({
                variables:{
                    id: projectId
                },
                query: gql `
                    query (
                        $id: String
                    ){
                        queryFileData (
                            id: $id
                        ) {
                            id
                            label
                            data
                        }
                    }
                `
            })
            //query the pharmacy data by pharmacyId and store the data in "pharmacyById" object
            await this.getPharmacyById(data.queryFileData.data.find(element => element.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text),
            this.project = {
                label: data.queryFileData.label,
                id: data.queryFileData.id,
                year: data.queryFileData.data.find(element => element.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                name: data.queryFileData.data.find(element => element.elementId == "5187f38c-c1b7-4f8e-9c00-b87f703650ee").data.text,
                status: data.queryFileData.data.find(element => element.elementId == "ad0ecf0d-bfe2-4d34-9ceb-df9cac26cd2a").data.text,
                //find the data in the "pharmacyById" object
                pharmacy: this.pharmacyById[data.queryFileData.data.find(element => element.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text].label,
                pharmacyAbb: this.pharmacyById[data.queryFileData.data.find(element => element.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text].data.find(element => element.elementId == "91f42e63-98b4-462b-bf65-58b416718cb0").data.text
            }
            this.loading = false
        }
    },
    watch:{
        selectedProjectId:{
            handler(){
                this.getProjectById(this.selectedProjectId)
            }
        },
        fileBySchemaId: {
			deep: true,
			handler () {
				this.$store.commit('file/setFileList', this.fileBySchemaId)
			}
		}
    },
    computed: {
        ...mapGetters({
            getDirectory: "directory/getDirectory"
        })
    },
}
</script>

<style>
.singleProjectBackground{
    background-color: #272727;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    max-width: 900px;
    display: flex;
}
</style>