<template>
	<div class="container">
		<div>
			<div class="topSection">
				<v-btn
					style="min-width:0"
					class="addProject"
					color="green"
					@click="openNewProject(true)"
				>
					<v-icon>
						mdi-note-plus-outline
					</v-icon>
				</v-btn>
				<div class="searchContainer">
					<selectYear class="selectYearComponent" @sendYear="captureMyYear" />
					<search @sendValue="captureMySearchValue"/>
				</div>
			</div>
			<div class="body">
				<popUp
					v-if="popUp"
					@closeNewProject="openNewProject($event)"
					@saveSuccess="projectSaved"
				/>
				<v-data-table
					v-if="headers"
					:headers="headers"
					:items="items"
					:items-per-page="20"
					:search="search"
					class="table"
					:header-props="{ sortIcon: null }"
					:sort-by="'Nummer'"
					:sort-desc="true"
				>
					<template 
						#item.actions="{item}"
						v-slot:item="props">
							<div class="icons">
								<v-icon>
									mdi-timer-edit-outline
								</v-icon>
								<v-icon>
									mdi-pencil-outline
								</v-icon>
								<button
									@click=copyToClipboard(item) 
									class="copyIcon"
									:ref="item.id"
									title="In die Zwischenablage kopieren!">
									<v-icon>
										mdi-content-copy
									</v-icon>
								</button>
							</div>
					</template>
				</v-data-table>
			</div>
		</div>
		<v-snackbar
			:top="true"
			height="10px"
			v-model="snackbar"
			color="green"
			:timeout="timeoutSnackbar"
		>
			{{ text }}
		</v-snackbar>
	</div>	
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
import search from "~/components/frontEnd/search";
import selectYear from "~/components/frontEnd/selectYear";
import popUp from "~/components/frontEnd/lib/popUp";
import { MainDirectory } from '~/assets/directoryClasses'
import  { mergeSchemas } from '~/assets/classes/objectClasses'
export default {
	components: {
    search,
    selectYear,
    popUp
},
    data() {
        return {
            headers: [],
            items: [],
            search: "",
			year: "",
			copy:[],
			timeout: null,
			popUp: false,
			snackbar: false,
			text: '',
      		timeoutSnackbar: 2200,
			files: null,
			schema: null,
			querySchemaById: null,
			fileBySchemaId: null,
			directory: null,
			ids:["ca78b111-d1f0-4b4b-b82c-c7e727804b0b", "77ffa6dc-8676-4ee3-acae-d12697f608a1"]
        };
    },
    apollo: {
		files: gql`
			query {
				files {
					fileId: id
					label
					schemaId
				}
			}
		`,
		schema: gql`
			query Schemes {
				schema {
					id
					label
					metadata
				}
			} 
		`,
        //data with query from the projects
        fileBySchemaId: gql `
			query Files {
				fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					label
					data
					id
				}
			}
		`,
        //data with query from the metadata
        querySchemaById: gql `
			query PreviewList {
				querySchemaById(id: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					label
					metadata
					elements
				}
			}
		`,
        directory: gql `
			query egal{
				directory{
					id
					hierarchy
				} 
			}
		`
    },

    methods: {
		// function that is called when the project has been successfully saved
		projectSaved () {
			// refetching of all the files
			this.$apollo.queries.files.refetch()
			// refetching of all the schema
			this.$apollo.queries.schema.refetch()
			// refetching of all the projects
			this.$apollo.queries.fileBySchemaId.refetch()
			// refetching of the project-query
			this.$apollo.queries.querySchemaById.refetch()
			// refetching of the directory
			this.$apollo.queries.directory.refetch()
			// setting the popUp-value to false (closing the popUp)
			this.popUp = false
		},

		async openNewProject(value){
			this.popUp = value;
			//variable to store the schemas
			let schemas = [];
			//query the both schema
			for(const item of this.ids){
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
					if(schemas.length === this.ids.length){
						let asd3 = mergeSchemas(schemas[0], schemas[1]);
						console.log(asd3)
					}
				})
			}
		},
		copyToClipboard(dataToCopy){
			const refName = dataToCopy.id;
			//setting the snackbar true
			this.snackbar = true;
			this.text = "Projekt in der Zwischenablage kopiert!"
			//adding animated class to the correct copy SVG
			this.$refs[refName]?.classList.remove("animated");
			this.$refs[refName]?.classList.add("animated");
			this.timeout = setTimeout(() => {
        		this.$refs[refName]?.classList.remove("animated");
      		}, 500);
			//copying the text to the clipboard without the last element of array
		 	navigator.clipboard.writeText(Object.values(dataToCopy).slice(0,4).join("-"));
		},
		captureMySearchValue(value){
			this.search = value;
		},
		captureMyYear(myYear){
			this.year = myYear;
		},
        dataFill() {
			this.headers = []
			this.items = []
            //filling the headers based on previewList
            for (const elementIdToFind of this.querySchemaById.metadata?.metadata_elements[0].parameters.previewList) {
                //merge the elements and the metadata
                for (const item of [...this.querySchemaById.elements, ...this.querySchemaById.metadata?.metadata_elements]) {
                    //if the element ID is the same as we need, it will push the label and add the elementIdToFind to the label
                    if (item.elementId === elementIdToFind) {
						if(item.label === "Jahr"){
							this.headers.push({
								text: item.label,
								align:'center',
								/*  width: "1%",  */
								sortable: false,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind,
								filter: value => {
									if (!this.year) return true
									return value.toString().includes(this.year.toString())
								}
                        	})	
						}
						 else if(item.label === "Nummer"){
							this.headers.push({
								text: item.label,
								width:"5%",
								align:'left',
								sortable: true,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
							})
						}
						/* else if(item.label === "Apo"){
							this.headers.push({
								text: item.label,
								width:"1%",
								align:'left',
								sortable: true,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
							})
						}   */
						else{
							this.headers.push({
								text: item.label,
								align:'center',
								sortable: true,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
                        });
						}
                        
                    }
                }
            }
            this.headers.push({
                text: "Actions",
				align:'center',
                sortable: false,
                value: "actions"
            });
            for (const rawItem of this.fileBySchemaId) {
                if (this.directory[0].hierarchy.some(e => e.fileId === rawItem.id)) {
                    //reseting the temorary new row
                    let newRow = {};
                    //merge the elements and the metadata
					for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
                        //creating the currentItem variable that contains the elementId of the currentItem
                        let currentItem = rawItem.data.find(item => item.elementId === elementIdToFind);
                        //creating the currentKey variable that contains the elementId of the headers
                        let currentKey = this.headers.find(item => item.elementId === elementIdToFind)?.value;
                        //setting the currentValue default to undefined
                        let currentValue;
                        if (currentItem) {
                            //if the currentItem exists sets to the currentValue of currentItem.data.text or to an empty string
                            currentValue = currentItem.data.text ?? "";
                        }
                        else if (rawItem.label && (currentKey === 'Nummer')) {
                            //if the data was not in elements than it muss be the label of rawItem
                            currentValue = rawItem.label;
                        }
                        //if the currentKey and the currentValue not undefined, than set the newRows value to currentValue
                        if (currentKey && currentValue) {
                            newRow[currentKey] = currentValue;
                        }
                    }
					//adding the elementId to the items array
					newRow["id"] = rawItem.id;
                    //pushing the newRow to the items Array 
                    this.items.push(newRow);
                }
            }
        },

		completeDirectory () {
			// function that takes in the raw data which are fetched when this component is created and processing so that a useable directory is formed
			// creating new instance by calling the MainDirectory class and passing it the raw data in the arguments
			const directory = new MainDirectory(JSON.parse(JSON.stringify(this.directory[0].hierarchy)), this.files, this.schema)
			// storing the newly created directory in the store
			this.$store.commit('directory/setToStoreDirectory', directory)
		},
    },
    watch: {
		// watcher to react to changes in the directory when it is called from the API
		directory: {
			deep: true,
			handler () {
				this.completeDirectory()
				this.dataFill()
			}
		},
		// watcher to react to changes in the files when they are called from the API
		files: {
			deep: true,
			handler () {
				this.completeDirectory()
			}
		},
		// watcher to react to changes in the schema when they are called from the API
		schema: {
			deep: true,
			handler () {
				this.completeDirectory()
			}
		},
		// watcher to react to changes in the projectSchema when it is called from the API
        querySchemaById: {
            deep: true,
            handler() {
                this.dataFill();
            }
        },
		// watcher to react to changes in the project-files when they are called from the API
		fileBySchemaId: {
			deep: true,
			handler () {
				this.dataFill()
			}
		}
    },
    computed: {
        ...mapGetters({
            getDirectory: "directory/getDirectory"
        })
    },
};
</script>

<style lang="scss" scoped>
@import url('~/assets/scss/componets/frontEnd/fileList.scss');

</style>
