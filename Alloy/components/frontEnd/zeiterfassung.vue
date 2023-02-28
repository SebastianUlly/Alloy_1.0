<template>
	<div>
		<v-data-table 
			v-if="headers"
			:headers="headers"
			:items="items"
			:single-expand="singleExpand"
			:expanded.sync="expanded"
			show-expand
			:loading="loading"
			:search="searchValue"
    	>
		<template v-if="showActions" #item.actions="{item}" v-slot:item="props">
			<div class="icons">
					<button @click="$emit('getClickedItem', item)">
						<v-icon>
							mdi-timer-edit-outline
						</v-icon>
					</button>
					<button @click="$emit('setConfirmPopUpData', item, 'delete', 'Löschen bestätigen')">
						<v-icon> 
							mdi-delete-outline
						</v-icon>
					</button>
				</div>
		</template>
			<template v-slot:expanded-item="{ headers, item }">
				<td :colspan="headers.length">
					{{item.Beschreibung}}
				</td>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import gql from "graphql-tag";
import { v4 as uuidv4 } from 'uuid';

export default {
	name: "zeiterfassung",
	props: {
		points: {
			type: Array,
			required: true
		},
		searchValue:{
			type: String
		},
		year: {
			type: String
		},
		showActions: {
			type: Boolean
		},
		paidHolidays: {
			type: Array
		},
		refreshKWList:{
			type: Array
		}
	},
	data() {
		return {
			items: [],
			headers: [],
			miscellaneous:{},
			pharmacyById: {},
			weekday : ["So","Mo","Di","Mi","Do","Fr","Sa"],
			expanded: [],
			singleExpand: true,
			loading: true
		};
	},
	apollo: {
		fileBySchemaId: gql`
			query fileBySchemaId {
				fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					id
					label
					data
				}
			}
		`,
		querySchemaById: gql`
			query PreviewList {
				querySchemaById(id: "3c20a10b-e836-494b-b010-e2a124735ea3") {
					label
					metadata
					elements
				}
			}
		`
	},
  	methods: {
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
		async getDataFromMiscellaneous(id){ 
			//optimizing the query, when the desired miscellaneous exists, break and returns it
			if(this.miscellaneous[id]){
				return this.miscellaneous[id];
			}
			this.miscellaneous[id] = (await this.$apollo.query({
				variables: {
					schemaId: id
				},
				query: gql`
					query (
						$schemaId: String
					) {
						miscellaneousById(
						id: $schemaId){
							id
							label
							data
						}
					}
				`
				})).data.miscellaneousById;
			return this.miscellaneous[id];
		},
		headersFill(){
			if(this.querySchemaById){
				this.headers = [];
				//looping trough the point schema elements
				for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
						const item = this.querySchemaById.elements.find(item => item.elementId === elementIdToFind);
						//if the item of the previewList has a pair
						if(item?.elementId == "65138254-8e1f-4b0b-91ae-70540e468459"){
							this.headers.push({
								text: item.label,
								align: "left",
								sortable: false,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
							});
							continue;
						}
						if (item) {
							//pushiing the object to the headers array
							this.headers.push({
								text: item.label,
								align: "center",
								sortable: false,
								value: item.label.replace(/[^a-zA-Z ]/g, ""),
								elementId: elementIdToFind
							});
						//if the previewList contains not an elementId, but a text
						} else {
							this.headers.push({
								text: elementIdToFind,
								align: "center",
								sortable: false,
								value: elementIdToFind,
								elementId: elementIdToFind
							});
						}
					}
				if (this.showActions) {
					//adding the actions column
					this.headers.push({
						text: "Actions",
						align:'center',
						sortable: false,
						value: "actions"
					});
				}
				this.headers.push({
					text: "",
					value: "data-table-expand"
				});
			}
		},
		async itemsFill() {
			let tempItems = [];
			this.loading = true;
			if (this.querySchemaById) {
				//filling the table
				if(this.points){
					for (const rawItem of this.points) {
						let newRow = {};
						for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
							//creating the currentItem variable that contains the elementId of the currentItem
							let currentItem = rawItem.data.find(item => item.elementId === elementIdToFind);
							//creating the currentKey variable that contains the elementId of the headers
							let currentKey = this.headers.find(item => item.elementId === elementIdToFind)?.value;
							//setting the currentValue default to undefined
							let currentValue;
							if (currentItem) {
								//looping through the elements to find, where the parameters exist
								for(const item of this.querySchemaById.elements){
									//if the parameters dont exists continues the next element of elements
									if(!item.parameters){
										continue;
									}
									//getting the list of Miscellaneous with the getDataFromMiscellaneous function
									for(const temp of (await this.getDataFromMiscellaneous(item.parameters?.selectableMiscellaneous)).data){
										//if the point has an elementId in the data.text and its the same as the miscellaneous id
										if(temp.id == currentItem.data.text){
											//than overwrite the currentValue with the name of the correct miscellaneous data 
											currentValue = temp.name;
										}
									}
								}

								if(currentItem.elementId == "d43d0fd0-172d-4b7a-a942-990597d3cb42"){
									const [day, month, year] = currentItem.data.text.split(".")
									currentValue = day + "." + month + "." + year
								}
								if(!currentValue){
									//if the currentItem exists sets to the currentValue of currentItem.data.text or to an empty string
									currentValue = currentItem.data.text ?? "";
								}
								//get the pharmacy
								if(currentItem.elementId == "0c9cf456-edc3-4779-b00c-14237863fa16"){
									if(currentItem.data.text){
										currentValue = (await this.getPharmacyById(currentItem.data.text)).data.find(e => e.elementId == "91f42e63-98b4-462b-bf65-58b416718cb0").data.text ?? "";
									}
								}
								//if the elementIdToFind (from headers) is the project (projectId)
								if(elementIdToFind == "30a1d57d-ac51-4a54-9f83-2c493253b944"){
									//searching the file and the correct year
									for(const file of this.fileBySchemaId){
										for(const fileData of file.data){
											if(fileData.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d" && currentValue == file.id){
												//bind the two data with each other
												currentValue = [fileData.data.text, file.label].join('-')
											}
										}
									}
								}
							}
							//if the currentKey and the currentValue not undefined, than set the newRows value to currentValue
							if (currentKey && currentValue) {
								newRow[currentKey] = currentValue;
							}
						}
						//adding the elementId to the items array
						newRow["id"] = rawItem.id;
						//save the string as we store the date
						const str = rawItem.data.find(e => e.elementId === 'd43d0fd0-172d-4b7a-a942-990597d3cb42').data.text;
						//creating the format of the Date object
						const [day, month, year] = str.split('.');
						//create the Date object
						const date = new Date(+year, +month - 1, +day);
						//getting the abbreviation from the array
						newRow["Tag"] = this.weekday[date.getDay()];
						//pushing the newRow to the items Array 
						tempItems.push(newRow)
					}
					// for (const holiday of paidHolidays) {
					// 	const [day, month, year] = holiday.date.split('.');
					// 	//create the Date object
					// 	const date = new Date(+year, +month - 1, +day);
					// 	//getting the abbreviation from the array
					// 	newRow["Tag"] = this.weekday[date.getDay()];
					// 	tempItems.push(newRow)
 					// }
					//sort the tempItems by date
					tempItems.sort(function (a, b) {
						//trick to not manipulate the original object
						const aTemp = JSON.parse(JSON.stringify(a))
						const bTemp = JSON.parse(JSON.stringify(b))
						//tempolary adding the year to the datum
						aTemp.Datum = aTemp.Datum.split('.')[1] + '.' + aTemp.Datum.split('.')[0] + '.' + aTemp.Datum.split('.')[2]
						bTemp.Datum = bTemp.Datum.split('.')[1] + '.' + bTemp.Datum.split('.')[0] + '.' + bTemp.Datum.split('.')[2]
						//the sort function
						return (bTemp.Datum > aTemp.Datum) ? 1 : (bTemp.Datum < aTemp.Datum) ? -1 : 0;
					})
					//restore the items by deleting the year
					for (const item of tempItems) {
						item.Datum = item.Datum.split('.')[0] + '.' + item.Datum.split('.')[1]
					}
				} 

				if(this.paidHolidays){
					for (const holiday of this.paidHolidays) {
						let newRow = {};
						for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
							//creating the currentKey variable that contains the elementId of the headers
							let currentKey = this.headers.find(item => item.elementId === elementIdToFind)?.value;
														
							const dateKey = this.headers.find(item => item.elementId === 'd43d0fd0-172d-4b7a-a942-990597d3cb42')?.value;
							const dateValue = holiday.date
							newRow[dateKey] = dateValue;
								
							const pharmacyKey = this.headers.find(item => item.elementId === '0c9cf456-edc3-4779-b00c-14237863fa16')?.value;
							const pharmacyValue = (await this.getPharmacyById('15550a00-46dd-4695-8650-e7ab0f0ce738')).data.find(e => e.elementId == "91f42e63-98b4-462b-bf65-58b416718cb0").data.text ?? "";
							newRow[pharmacyKey] = pharmacyValue;

							//searching the file and the correct year
							const file = this.fileBySchemaId.find(item => item.id === '4e5f968b-5314-46e3-85a5-95d22db27047')
							for(const fileData of file.data){
								if(fileData.elementId == "577aa568-345a-47e5-9b71-848d5695bd5d"){
									const projectKey = this.headers.find(item => item.elementId === '30a1d57d-ac51-4a54-9f83-2c493253b944')?.value;
									//bind the two data with each other
									const projectValue = [fileData.data.text, file.label].join('-')
									newRow[projectKey] = projectValue;
								}
							}
							

							for(const temp of (await this.getDataFromMiscellaneous('e0bef030-e8ed-45d5-a06a-e5f40eaf4c5d')).data){
								if(temp.id == '2ed7c498-1b47-46f2-9f7f-74f8f7959cff'){
									const typeKey = this.headers.find(item => item.elementId === 'f951c3cf-1594-435e-85be-e951be00bb44')?.value;
									const typeValue = temp.name
									newRow[typeKey] = typeValue;
								}
							}
						}
						//adding the elementId to the items array
						newRow["id"] = uuidv4();
						//save the string as we store the date
						const str = holiday.date;
						//creating the format of the Date object
						const [day, month, year] = str.split('.');
						//create the Date object
						const date = new Date(+year, +month - 1, +day);
						//getting the abbreviation from the array
						newRow["Tag"] = this.weekday[date.getDay()];
						//pushing the newRow to the items Array 
						tempItems.push(newRow)
					}

					//sort the tempItems by date
					tempItems.sort(function (a, b) {
						console.log(a)
						//trick to not manipulate the original object
						const aTemp = JSON.parse(JSON.stringify(a))
						const bTemp = JSON.parse(JSON.stringify(b))
						//tempolary adding the year to the datum
						aTemp.Datum = aTemp.Datum.split('.')[1] + '.' + aTemp.Datum.split('.')[0] + '.' + aTemp.Datum.split('.')[2]
						bTemp.Datum = bTemp.Datum.split('.')[1] + '.' + bTemp.Datum.split('.')[0] + '.' + bTemp.Datum.split('.')[2]
						//the sort function
						return (bTemp.Datum > aTemp.Datum) ? 1 : (bTemp.Datum < aTemp.Datum) ? -1 : 0;
					})
					//restore the items by deleting the year
					for (const item of tempItems) {
						item.Datum = item.Datum.split('.')[0] + '.' + item.Datum.split('.')[1]
					}
				} 
			}
			this.items = tempItems
			this.loading = false;
		}
	},

	watch: {
		querySchemaById: {
			deep: true,
			handler() {
				this.headersFill();
				this.itemsFill();
			}
		},
		points: {
			deep:true,
			handler(){
				this.itemsFill()
			}
		},
		refreshKWList:{
			deep: true,
			handler(){
				this.itemsFill()
			}
		}
	} 
};
</script>
<style>
.addProject{
	width: 49px;
	height: 49px;
}
tbody > tr > td:nth-of-type(8){
  text-overflow: ellipsis;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
}
.v-data-table-header th, .v-data-table__wrapper td{
    border-bottom: thin solid #ffffff73 !important; 
}
</style>
