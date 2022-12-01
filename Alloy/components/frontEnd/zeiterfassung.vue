<template>
	<div>
		<v-data-table 
      v-if="headers"
      :headers="headers"
      :items="items"
    >
      <template #item.actions="{item}" v-slot:item="props">
        <div class="icons">
									<button @click="$emit('getClickedItem', item)">
										<v-icon>
											mdi-timer-edit-outline
										</v-icon>
									</button>
									<button>
										<v-icon> 
											mdi-delete-outline
										</v-icon>
									</button>
								</div>
      </template>
    </v-data-table>
		<!-- <vue-json-pretty :data="headers" /> -->
		
	</div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "zeiterfassung",

  props: {
    points: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      items: [],
      headers: [],
      miscellaneous:{},
      weekday : ["So","Mo","Di","Mi","Do","Fr","Sa"],
      ids:["c519459a-5624-4311-bffb-838d43e7f0d0"],
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
    async dataFill() {
      //clearing the headers and items to avoid duplicated keys, when the watcher runs
      this.items = [];
      this.headers = [];
    if (this.querySchemaById) {
        //looping trough the point schema elements
        for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
          const item = this.querySchemaById.elements.find(item => item.elementId === elementIdToFind);
          //if the item of the previewList has a pair
          if (item) {
            //pushiing the object to the headers array
            this.headers.push({
              text: item.label,
              align: "center",
              sortable: false,
              value: item.label.replace(/[^a-zA-Z ]/g, ""),
              elementId: elementIdToFind
            });
        //if the previewList contains not an elementId, but an text
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
        //adding the actions column
        this.headers.push({
            text: "Actions",
            align:'center',
            sortable: false,
            value: "actions"
        });
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
                if(!currentValue){
                  //if the currentItem exists sets to the currentValue of currentItem.data.text or to an empty string
                  currentValue = currentItem.data.text ?? "";
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
            const str = rawItem.data[0].data.text;
            //creating the format of the Date object
            const [day, month, year] = str.split('.');
            //create the Date object
            const date = new Date(+year, +month - 1, +day);
            //getting the abbreviation from the array
            newRow["Tag"] = this.weekday[date.getDay()];
						//pushing the newRow to the items Array 
						this.items.push(newRow);
          }
        } 
      }
      
    }
  },
  mounted(){
    /* this.dataFill(); */
  },
  watch: {
    querySchemaById: {
      deep: true,
      handler() {
        this.dataFill();
      }
    },
    points:{
      deep:true,
      handler(){
        this.dataFill()
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
</style>
