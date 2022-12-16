<template>
	
	<div class="container">
		<ClientOnly>
			<div>
				<!-- the top sectioin contains the new addProject button yearSelect and the SearchFIeld -->
				<div class="topSection">
					<!-- the button sets the popUp variable true and the popUp window will appear -->
					<v-btn
						v-show="checkPermissionIdsHere('a9c5c480-c9d9-4564-9e21-3c78c493f203')"
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
						<selectYear class="selectYearComponent" @sendYear="captureMyYear" v-if="checkPermissionIdsHere('b77ac80c-39ea-4550-b04c-843ad07a3672')"/>
						<search @sendValue="captureMySearchValue" v-if="checkPermissionIdsHere('b77ac80c-39ea-4550-b04c-843ad07a3672')"/>
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
						v-if="headers && items && checkPermissionIdsHere('576f02ff-7e02-401c-872e-ab3a2972ca2b')"
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
									<button v-if="checkPermissionIdsHere('658c3149-1004-4ab9-9c1c-032390a61497')">
										<v-icon>
											mdi-timer-edit-outline
										</v-icon>
									</button>
									<!-- the pencil icon is in the middle, it opens the edit project popUp -->
									<button 
										@click="openEditProject(item)"
										v-if="checkPermissionIdsHere('b4ac64b2-48ab-4509-84bf-d82e3196c1d1')"
										:ref="item.id"
										>
										<v-icon> 
											mdi-pencil-outline
										</v-icon>
									</button>
									<!-- copy to the clipboard icon is the last icon, if clicked, calls the copyToClipboard functioin and the snackbar function, copyes the text to the clipboard -->
									<button
										v-if="checkPermissionIdsHere('006f7d44-7c87-4292-990f-31385e56dfb8')"
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
		</ClientOnly>
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
import { checkPermissionId } from '~/assets/functions/permission'
import { data } from "browserslist";
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
			clickedFile:"",
			isActionAvailable: 0,
			pharmacyAbb:{},
			isFillingData: false
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
			this.$store.commit("file/resetEnteredData")
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
        async dataFill() {
			if (this.querySchemaById && this.directory && this.fileBySchemaId && this.files && this.schema && !this.isFillingData) {
				this.headers = []
				this.items = []
				this.isFillingData = true;
				//filling the headers based on previewList
				for (const elementIdToFind of this.querySchemaById.metadata?.metadata_elements[0].parameters.previewList) {
					//merge the elements and the metadata
					for (const item of [...this.querySchemaById.elements, ...this.querySchemaById.metadata?.metadata_elements]) {
						//if the element ID is the same as we need, it will push the label and add the elementIdToFind to the label
						if (item.elementId === elementIdToFind) {
							//checking if the row permissioinId needed or the user the permission has
							if(item.permissionId && !this.checkPermissionIdsHere(item.permissionId)){
								//if the permissinId exists but the user has no permission to see this row the continue will exacute
								//it means that the for loop will jump to the next element
								continue;
							}
							if(item.label === "Jahr"){
								//pushing the row (object) with the following settings to the headers (array)
								this.headers.push({
									//the header name is the label of the item
									text: item.label,
									//position is center of this row
									align:'center',
									//it is not shortable by the Year
									sortable: false,
									//the value is the "key" that tells the table where to load the elements
									//it should not contain spaces, capital letters, special characters
									value: item.label.replace(/[^a-zA-Z ]/g, ""),
									//giving the elementId to the headers object too
									elementId: elementIdToFind,
									// filtering the projects to get just the list with the desired year (value comes from the selectYear component)
									filter: value => {
										if (!this.year) return true
										return value.toString().includes(this.year.toString())
									}
								})	
							}
							// the number is a special case where the width and the align must be set
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
							//every other case it will push with these default settings
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
				//pushing the actions row to the headers
				if(this.checkPermissionIdsHere('1acc9577-f847-4c8a-bc58-b32812d16ce6')){
					this.headers.push({
						text: "Actions",
						align:'center',
						sortable: false,
						value: "actions"
					});
				}
				for (const rawItem of this.fileBySchemaId) {
				try {
					if (this.directory[0].hierarchy.some(e => e.fileId === rawItem.id)) {
						//reseting the temporary new row
						let newRow = {};
						//merge the elements and the metadata
						for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
							//creating the currentItem variable that contains the elementId of the currentItem
							let currentItem = rawItem.data.find(item => item.elementId === elementIdToFind);
							//creating the currentKey variable that contains the elementId of the headers
							let currentKey = this.headers.find(item => item.elementId === elementIdToFind)?.value;
							//setting the currentValue default to undefined
							let currentValue;
							if(currentKey === 'Apotheke'){
								let temp = await this.getPharmacyAbb(currentItem.data.text)
								if(temp.data.queryFileData.data[0].data.text !== "BOCOM"){
									currentValue = temp.data.queryFileData.data[0].data.text
								}
							}
							else if (currentItem) {
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
					} catch (error) {
						console.log(error, rawItem)
					}
				}
				this.isFillingData = false;
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
		//checks if the permissionId is in the permissionIds list and sends the permissionId to the checkPermissionId function
		checkPermissionIdsHere (arg) {
			if (this.permissionIds) {
				return checkPermissionId(this.permissionIds, arg)
			}
			return false
		}
    },
    watch: {
		// watcher to react to changes in the directory when it is called from the API
		directory: {
			deep: true,
			async handler () {
				this.completeDirectory()
				await this.dataFill()
			}
		},
		// watcher to react to changes in the files when they are called from the API
		files: {
			deep: true,
			async handler () {
				this.completeDirectory()
				await this.dataFill()
			}
		},
		// watcher to react to changes in the schema when they are called from the API
		schema: {
			deep: true,
			async handler () {
				this.completeDirectory()
				await this.dataFill()
			}
		},
		// watcher to react to changes in the projectSchema when it is called from the API
        querySchemaById: {
            deep: true,
            async handler() {
                await this.dataFill();
            }
        },
		// watcher to react to changes in the project-files when they are called from the API
		fileBySchemaId: {
			deep: true,
			async handler () {
				this.$store.commit('file/setFileList', this.fileBySchemaId)
				await this.dataFill()
			}
		}
    },
    computed: {
        ...mapGetters({
            getDirectory: "directory/getDirectory",
			permissionIds: 'authentication/getPermissionIds'
        })
    },
};
</script>

<style lang="scss" scoped>
@import url('~/assets/scss/componets/frontEnd/fileList.scss');
</style>
