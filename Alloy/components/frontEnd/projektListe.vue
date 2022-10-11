<template>
	<div class="container">
		<div>
			<!-- the top sectioin contains the new addProject button yearSelect and the SearchFIeld -->
			<div class="topSection">
				<!-- the button sets the popUp variable true and the popUp window will appear -->
				<v-btn
					style="min-width:0"
					class="addProject"
					color="green"
					@click="openNewProject(true)"
				>
					<!-- the icon with the file and + -->
					<v-icon>
						mdi-note-plus-outline
					</v-icon>
				</v-btn>
				<!-- the search container contains the events of searchComponent and the yearSelector -->
				<div class="searchContainer">
					<selectYear class="selectYearComponent" @sendYear="captureMyYear" />
					<search @sendValue="captureMySearchValue"/>
				</div>
			</div>
			<!-- the body div contains the data table and the popUp component if its opened -->
			<div class="body">
				<popUp
					v-if="popUp && popUpSchema"
					@closeNewProject="openNewProject($event)"
					@saveSuccess="projectSaved"
					:popUpSchema = "popUpSchema"
					:clickedFile = "clickedFile"
				/>
				<!-- the headers must be filled up with the data from the schema -->
				<!-- custom sorting, styleing settings can be made here -->
				<v-data-table
					v-if="headers && items"
					:headers="headers"
					:items="items"
					:items-per-page="20"
					:search="search"
					class="table"
					:header-props="{ sortIcon: null }"
					:sort-by="'Nummer'"
					:sort-desc="true"
				>
					<!-- this template contains the last column with the action buttons -->
					<template 
						#item.actions="{item}"
						v-slot:item="props">
							<!-- the icons div contains the action icons and buttons-->
							<div class="icons">
								<!-- the first icon is a timer watch with a small pencil at the corner, its open the set time popup-->
								<v-icon>
									mdi-timer-edit-outline
								</v-icon>
								<!-- the pencil icon is in the middle, it opens the edit project popUp -->
								<button @click="openEditProject(item)">
									<v-icon> 
										mdi-pencil-outline
									</v-icon>
								</button>
								<!-- copy to the clipboard icon is the last icon, if clicked, calls the copyToClipboard functioin and the snackbar function, copyes the text to the clipboard -->
								<button
									@click=copyToClipboard(item) 
									class="copyIcon"
									:ref="item.id"
									title="In die Zwischenablage kopieren!">
									<!-- copy icon -->
									<v-icon>
										mdi-content-copy
									</v-icon>
								</button>
							</div>
					</template>
				</v-data-table>
			</div>
		</div>
		<!-- the snackbar that appears on the top for 2,2s if the copy symbol clicked -->
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
import { mergeSchemas } from '~/assets/classes/objectClasses'
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
			popUpSchema: null,
			ids:["ca78b111-d1f0-4b4b-b82c-c7e727804b0b", "77ffa6dc-8676-4ee3-acae-d12697f608a1"],
			clickedFile:""
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
		},
		openEditProject(item){
			this.getDataForPopUp(["ca78b111-d1f0-4b4b-b82c-c7e727804b0b", "77ffa6dc-8676-4ee3-acae-d12697f608a1"]);
			this.popUp = true;
			this.clickedFile = item.id;
		},
		//set the boolean variable true and the popUp opens
		openNewProject(value){
			this.clickedFile = null;
			this.popUp = value;
			this.getDataForPopUp(["ca78b111-d1f0-4b4b-b82c-c7e727804b0b"]);
		},
		/* copyes the file data to the clipboard without the status */
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
		//captureing the search value from the search component
		captureMySearchValue(value){
			this.search = value;
		},
		//capturing the selected year from the component
		captureMyYear(myYear){
			this.year = myYear;
		},
        dataFill() {
			this.headers = []
			this.items = []
			if (this.querySchemaById && this.directory && this.fileBySchemaId && this.files && this.schema) {
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
			}
        },
		completeDirectory () {
			if (this.directory && this.files && this.schema) {
				// function that takes in the raw data which are fetched when this component is created and processing so that a useable directory is formed
				// creating new instance by calling the MainDirectory class and passing it the raw data in the arguments
				const directory = new MainDirectory(JSON.parse(JSON.stringify(this.directory[0].hierarchy)), this.files, this.schema)
				// storing the newly created directory in the store
				this.$store.commit('directory/setToStoreDirectory', directory)
			}
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
				this.dataFill()
			}
		},
		// watcher to react to changes in the schema when they are called from the API
		schema: {
			deep: true,
			handler () {
				this.completeDirectory()
				this.dataFill()
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
				this.$store.commit('file/setFileList', this.fileBySchemaId)
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
