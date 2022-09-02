<template>
	<div>
		<div class="topSection">
			<button
				class="addProject"
				color="green"
			>
				<v-icon
					small
					class="addProject">
					mdi-note-plus-outline
				</v-icon>
			</button>
			<selectYear @sendYear="captureMyYear" />
			<search @sendValue="captureMySearchValue"/>
		</div>
		
		<div class="body">
		<!-- <vue-json-pretty v-if="querySchemaById" :data="querySchemaById" /> -->
		<!-- <vue-json-pretty v-if="fileBySchemaId" :data="fileBySchemaId"/> -->
		<!-- <vue-json-pretty :data="directory[0].hierarchy"/> -->
		<!-- <h1>Headers</h1>
		<vue-json-pretty :data="headers" />  -->
		<!-- <vue-json-pretty :data="fileBySchemaId[1].id" /> -->
		<!-- <vue-json-pretty :data="items" /> -->
			<v-data-table
				:headers="headers"
				:items="items"
				:items-per-page="20"
				:search="search"
				class="table"
				:header-props="{ sortIcon: null }"
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
								class="copy"
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
	
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
import search from "~/components/frontEnd/search";
import selectYear from "~/components/frontEnd/selectYear";
export default {
	 components: {
      search,
	  selectYear
	 },
    data() {
        return {
            headers: [],
            items: [],
            search: "",
			year: "",
			copy:[],
			timeout: null,
        };
    },
    apollo: {
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
		copyToClipboard(dataToCopy){
			const refName = dataToCopy.id;
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
        //test button to fill the header
        dataFill() {
            //filling the headers based on previewList
            for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
                //merge the elements and the metadata
                for (const item of [...this.querySchemaById.elements, ...this.querySchemaById.metadata.metadata_elements]) {
                    //if the element ID is the same as we need, it will push the label and add the elementIdToFind to the label
                    if (item.elementId === elementIdToFind) {
						if(item.label === "Jahr"){
							this.headers.push({
								text: item.label,
								align:'center',
								/*  width: "1%",  */
								sortable: true,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind,
								filter: value => {
									if (!this.year) return true
									return value.toString().includes(this.year.toString())
								}
                        	})	
						}
						/* else if(item.label === "Nummer"){
							this.headers.push({
								text: item.label,
								width:"5%",
								align:'left',
								sortable: true,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
							})
						}
						else if(item.label === "Apo"){
							this.headers.push({
								text: item.label,
								width:"1%",
								align:'left',
								sortable: true,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
							})
						}  */
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
                    // for (const elementIdToFind of [...this.querySchemaById.metadata.metadata_elements[0].parameters.previewList, ...this.querySchemaById.metadata.metadata_elements]) {
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
    },
    watch: {
        querySchemaById: {
            deep: true,
            handler() {
                this.dataFill();
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

<style lang="scss">
@import url('~/assets/scss/componets/frontEnd/fileList.scss');

</style>
