<template>
    <div class="popUp">
        <div class="popUpTop">
            <span class="infoIcon">
                <v-icon v-if="icon">
                {{icon}}
                </v-icon>
            </span>
            <span class="label">
                Projekt hinzufügen
            </span> 
            <span  class="closeIcon">
                <div class="whiteBackground">
                </div>
                <button
                @click="closeNewProject()"
                >
                    <v-icon color="red" large>
                        mdi-close-box
                    </v-icon>
                </button>
            </span>
        </div>
        <div class="popUpBody" v-if="querySchemaById">
            <div class="inputContainer">
                    <component
                    v-for="item of querySchemaById.elements" :key="item.elementId"
					:is="item.componentId"
					:elementId="item.elementId"
                    :label="item.label"
                    :parameters="item.parameters"
                    :class="item.parameters.size"
                    @update="getDataFromComponent"
                    @getCurrentFolderId = "setParentId"
				    />
                <!-- <vue-json-pretty :data="querySchemaById" /> -->
            </div>
        </div>
        <div class="addButtonDiv">
            <v-btn class="addButton" @click=createFile() :loading="false" color="green" large style="min-width:0"> Projekt hinzufügen</v-btn>
        </div>
          <!-- <vue-json-pretty :data="nestedArray" /> -->
    </div>
</template>

<script>
import gql from "graphql-tag"
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from "uuid"
import { NestedArray } from '~/assets/classes/arrayClasses'
import { AddEntityToDirectory } from '~/assets/directoryClasses'
import frontEndInput from '~/components/frontEnd/lib/inputComponenets/frontEndInput'
import frontEndSelectInput from '~/components/frontEnd/lib/inputComponenets/frontEndSelectInput'
import FrontEndSelectInput from "./inputComponenets/frontEndSelectInput.vue"
export default {
    components:{
        frontEndInput,
        frontEndSelectInput,
        FrontEndSelectInput
    },
    data(){
        return{
            payload:"",
            nestedArray: null,
            nestedArrayElements: null,
            icon: ""
        }
    },

    computed:  {
        ...mapGetters({
            directory: 'directory/getDirectory',
            getDataToSave: 'file/getDataToSave',
            getValuesToSave: 'file/getValuesToSave'
        })
    },
    methods:{
        //getting the parentId from the actual folder
        setParentId(parentId){
            this.$store.commit("file/setParentIdsToEnteredValues", [parentId])
        },
        getDataFromComponent(data){
           //if the data = name than commit it to the setFileNameToEnteredValues otherwise to the setEnteredData
            if(data.elementId === "75e96f94-0103-4804-abc0-5331ea980e9b"){
                this.$store.commit("file/setFileNameToEnteredValues", data.data.text)
            } else{
                this.$store.commit("file/setEnteredData", data)
            }
        },
        //close the popUp window
        closeNewProject(){
            this.$emit('closeNewProject', false)
        },
        createNewFile(){
            //generate new file id for the project
            const newId = uuidv4();
            this.$store.commit("file/setFileIdToEnteredValues", newId),
            //sending the schemaId
            this.$store.commit("file/setSchemaIdToEnteredValues", this.querySchemaById.metadata.schemaId)
        },
        createFile () {
			this.$apollo.mutate({
				variables: {
					metadata: this.getValuesToSave,
					elementsData: this.getDataToSave
				},

				mutation: gql`
					mutation (
						$metadata: JSON
						$elementsData: JSON
					) {
						createFile (
							metadata: $metadata
							elementsData: $elementsData
						) {
							id
						}
					}
				`
			}).then((data) => {
                // create a new instance to add the file to the directory on every reqired location
				const directoryWithAddedEntity = new AddEntityToDirectory(
					this.directory,
					{
						fileId: this.getValuesToSave.fileId,
						label: this.getValuesToSave.label,
						schemaId: this.getValuesToSave.schemaId,
						isLeaf: this.querySchemaById?.metadata?.isLeaf
					},
					this.getValuesToSave.parentIds)
				// commiting the edited directory to the store
				this.$store.commit('directory/setToStoreDirectory', directoryWithAddedEntity.directoryCopy);
                this.saveDirectory()
			}).catch((error) => {
				console.log({ error })
			})
		},

        // function to save the changed directory (SUL)
		saveDirectory () {

			this.$apollo.mutate({
				variables: {
					directory: this.directory
				},

				mutation: gql`
					mutation(
						$directory: JSON
					) {
						saveDirectory(
							directory: $directory
						) {
							id
						}
					}
				`
			}).then(() => {
                this.$emit("saveSuccess")
			}).catch((error) => {
				console.log({ error })
			})
		},
    },
    //queries the data from the database from the New-Project-PopUp
    apollo:{
        querySchemaById: gql `
			query PreviewList {
				querySchemaById(id: "ca78b111-d1f0-4b4b-b82c-c7e727804b0b") {
                    id
					label
					metadata
					elements
				}
			}
		`
    },
    watch: {
        querySchemaById: {
			deep: true,
			handler () {
                //updating the icon if its available
                this.icon = String(this.querySchemaById?.metadata?.icon);
                this.createNewFile();
			}
		} 
	}
}

</script>

<style lang="scss" scoped>
$gap-size: 15px;
$columns: 12;
.test{
    width: auto;
}
.popUp{
    position: absolute;
    top: 300px;
    left: 25%;
    z-index: 2;
    margin: 30px;
    border-radius: 3px;
    height: auto;
    width: 425px;
    background-color: #4D4D4D;
    justify-content: center;
    text-align: center;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
} 
.popUpTop{
    position: relative;
    height: 41px;
    width: 425px;
    background-color:#282828;
    border-start-start-radius: 3px;
    text-align: center;
    justify-content: center;
    display: table-cell; 
    vertical-align: middle;
    padding: 0 10 0 10;
}
.popUpBody{
    padding: 34px 22px;
}
.addButtonDiv{
    margin-bottom: 20px;
}
.label{
    font-size: 20px;
}
.infoIcon{
    float: left;
    margin-top: 5px;
    margin-left: 9px;
}
.closeIcon{
    float: right;
    margin-right: 3px;
}
.whiteBackground{
    position: absolute;
    right: 10px;
    top: 10px;
    height: 20px;
    width: 20px;
    background-color: white;
}
.inputContainer{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: $gap-size;
}
.inputAlignCenter{
    align-items: center;
}
.inputAlignRight{
    align-items: right;
}
@mixin col-x-list {
  @for $i from 1 through $columns {
    @for $j from 1 through $i {
      .col-#{$j}-#{$i}th {
        width: calc(calc(calc(100% - calc(#{$gap-size / #{$j}} * #{$i - $j})) / #{$i}) * #{$j});
        display: flex;
        justify-content: center;
        object-fit: cover;
      }
    }
    .col-#{$i}th {
        width: calc(calc(100% - calc(#{$gap-size} * #{$i - 1})) / #{$i});
        display: flex;
        justify-content: center;
        object-fit: cover;
      }
   } 
}

@include col-x-list;
</style>