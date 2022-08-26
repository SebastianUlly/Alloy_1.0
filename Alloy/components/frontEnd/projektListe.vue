<template>
	<div>
		<!-- <vue-json-pretty v-if="querySchemaById" :data="querySchemaById" /> -->
		<!-- <vue-json-pretty v-if="fileBySchemaId" :data="fileBySchemaId"/> -->
		<!--  <vue-json-pretty :data="directory[0].hierarchy"/>
		<h1>Headers</h1>
		<vue-json-pretty :data="headers" /> 
		<vue-json-pretty :data="fileBySchemaId[1].id" />
		<vue-json-pretty :data="items" /> -->
		<input type="text" v-model="search" />
		<v-data-table
			:headers="headers"
			:items="items"
			:items-per-page="20"
			:search="search"
			class="elevation-1"
		></v-data-table>
	</div>
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
export default {
	data() {
		return {
			headers:[],
			items: [],
			search: ""
		};			
  	},
	apollo: {
		//data with query from the projects
		fileBySchemaId: gql`
			query Files {
				fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					label
					data
					id
				}
			}
		`,
		//data with query from the metadata
		querySchemaById: gql`
			query PreviewList {
				querySchemaById(id: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					label
					metadata
					elements
				}
			}
		`,
		directory: gql`
			query egal{
				directory{
					id
					hierarchy
				} 
			}
		`
	},
  methods: {
    //test button to fill the header
    dataFill() {
		//filling the headers based on previewList
		for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
			//merge the elements and the metadata
			for (const item of [...this.querySchemaById.elements, ...this.querySchemaById.metadata.metadata_elements]) {
				//if the element ID is the same as we need, it will push the label and add the elementIdToFind to the label
				if (item.elementId === elementIdToFind) {
					this.headers.push({
						text: item.label,
						sortable: true,
						value: item.label.replace(/[^a-zA-Z ]/g, ""),
						elementId: elementIdToFind
					});
				}
			}
		}
		for(const rawItem of this.fileBySchemaId){
			if(this.directory[0].hierarchy.some(e => e.fileId === rawItem.id)){
			    //reseting the temorary new row
				let newRow = {};
			    //merge the elements and the metadata
				for(const elementIdToFind of [...this.querySchemaById.metadata.metadata_elements[0].parameters.previewList, ...this.querySchemaById.metadata.metadata_elements]){
					//creating the currentItem variable that contains the elementId of the currentItem
					let currentItem = rawItem.data.find(item => item.elementId === elementIdToFind);
					//creating the currentKey variable that contains the elementId of the headers
					let currentKey = this.headers.find(item => item.elementId === elementIdToFind)?.value;
					//setting the currentValue default to undefined
					let currentValue;
					if (currentItem){
						//if the currentItem exists sets to the currentValue of currentItem.data.text or to an empty string
						currentValue = currentItem.data.text ?? "";
					}
					else if(rawItem.label){
						//if the data was not in elements than it muss be the label of rawItem
						currentValue = rawItem.label;
					}
					//if the currentKey and the currentValue not undefined, than set the newRows value to currentValue
					if(currentKey && currentValue){
						newRow[currentKey] = currentValue;
					}
				}
				//pushing the newRow to the items Array 
				this.items.push(newRow);
        	}
        }
    },
  },
	watch: {
		fileBySchemaId: {
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
	}
};
</script>

<style>
.elevation-1 {
	margin-top: 100px;
	max-width: 40%;
}
</style>
