<template>
    <div class="popUp">
        <!-- the popUpTop is the upper section of a popUp window, it contains the icon label and the close button -->
        <div class="popUpTop">
            <!-- icon -->
            <div class="infoIcon">
                <v-icon v-if="icon">
                   {{icon}}
                </v-icon>
            </div>
            <!-- the label -->
            <div class="popUpLabellabel" v-if="popUpSchema.label">
                {{popUpSchema.label}}
            </div>
            <!-- close button with white background closes the popUp window-->
            <div class="closeIcon">
                <button  @click="closeNewProject()">
                    <img :src="closeButtonImage" alt="">
                </button>
            </div>
        </div>
        <!-- the popUpBody contains the input components and the button-->
        <div class="popUpBody" v-if="popUpSchema && sendDataToInputs">
            <div class="inputContainer">
                    <component
                        v-for="item of popUpSchema.elements" :key="item.elementId"
                        :is="item.componentId"
                        :elementId="item.elementId"
                        :label="item.label"
                        :parameters="item.parameters"
                        :class="item.parameters.size"
                        @update="getDataFromComponent"
                        @getCurrentFolderId="setParentId"
                        :clickedFileId="clickedFile"
                        :elementIdToSearch="clickedFile"
                        :data="sendDataToInputs"
                        :permissions="item.permissions"
                        :selectedUserId="selectedUserId"
                        @sendNetto="getNetto"
                        @sendTaxValue="getTaxValue"
				    />
            </div>
        </div>
        <!-- add button at the bottom of popUp window calls the createFile function that saves the file to the database-->
        <div class="addButtonDiv">
            <v-btn
                v-if="popUpSchema.metadata"
                class="addButton"
                @click="selectFunction(popUpSchema.metadata.saveFunction)"
                :loading="false"
                :disabled="!readyToSave"
                color="green"
                large
                style="min-width:0"> Speichern </v-btn>
        </div>
    </div>
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { AddEntityToDirectory } from "~/assets/directoryClasses";
import frontEndInput from "~/components/frontEnd/lib/inputComponenets/frontEndInput";
import frontEndTimeInput from "~/components/frontEnd/lib/inputComponenets/frontEndTimeInput";
import frontEndDateInput from "~/components/frontEnd/lib/inputComponenets/frontEndDateInput";
import frontEndSelectInput from "~/components/frontEnd/lib/inputComponenets/frontEndSelectInput";
import frontEndTextArea from "~/components/frontEnd/lib/inputComponenets/frontEndTextArea";
import closeButtonImage from "~/assets/images/close-button.png"
import frontEndFileUpload from "~/components/frontEnd/lib/inputComponenets/frontEndFileUpload";

export default {
    props:{
        popUpSchema:{
            type: Object
        },
        clickedFile:{
            type: String
        },
        selectedUserId:{
            type: String
        }
    },
    components:{
        frontEndInput,
        frontEndSelectInput,
        frontEndTimeInput,
        frontEndDateInput,
        frontEndTextArea,
        frontEndFileUpload
    },
    data(){
        return{
            payload:"",
            icon: "",
            sendDataToInputs: {},
            closeButtonImage: closeButtonImage,
            taxValue: 0,
            nettoValue: 0
        }
    },

    computed:  {
        ...mapGetters({
            directory: "directory/getDirectory",
            getDataToSave: "file/getDataToSave",
            getValuesToSave: "file/getValuesToSave",
            fileList : "file/getFileList",
            readyToSave: "file/getReadyToSave",
            pointList: "point/getPointList",
            userMeta: 'authentication/getUserMeta'
        })
    },
    created(){
        this.$store.commit("file/resetIsInputOk")
        this.searchFile()
    },
    mounted () {
        this.createNewFile()
    },
    methods:{
        getTaxValue(taxValue){
            this.taxValue = parseInt(taxValue)
        },
        getNetto(netto){
            this.nettoValue = netto
        },
        setBruttoValue(){
            if(this.taxValue && this.nettoValue){
                console.log("asdawe")
                this.popUpSchema.elements.find(element => element.elementId == "4b156b8d-c58d-4ada-b1b8-65618258112d").parameters.default = (Math.ceil(parseFloat(this.nettoValue * (this.taxValue * 0.01 + 1)) * 10 ) / 10 ).toFixed(2) 

            }
        },
        isDayTypeHoliday(){
            //if Urlaub || Krankentag || Zeitausgleich clicked change the props for child components
            if(this.getDataToSave.find(item => item.elementId == "f951c3cf-1594-435e-85be-e951be00bb44")?.data?.text == "95aa87dc-9f80-4c33-8ccd-f59f543bec8e" ||
               this.getDataToSave.find(item => item.elementId == "f951c3cf-1594-435e-85be-e951be00bb44")?.data?.text == "33d8cd4d-4684-4408-aa39-9f513b2a186c" ||
               this.getDataToSave.find(item => item.elementId == "f951c3cf-1594-435e-85be-e951be00bb44")?.data?.text == "344e3d17-b014-4fb3-a365-883258b31e54"
            ){
                //set the 000-BOCOM project to the default when holiday clicked
                (this.popUpSchema.elements?.find(element => element.elementId == "30a1d57d-ac51-4a54-9f83-2c493253b944")).parameters["default"] = "4e5f968b-5314-46e3-85a5-95d22db27047";
                (this.popUpSchema.elements?.find(element => element.elementId == "30a1d57d-ac51-4a54-9f83-2c493253b944")).permissions.toEdit = false;
                //set the activity type to Administration
                (this.popUpSchema.elements?.find(element => element.elementId == "9a8284f2-5615-4cb5-893b-56cc3476b169")).permissions.toEdit = false;
                (this.popUpSchema.elements?.find(element => element.elementId == "9a8284f2-5615-4cb5-893b-56cc3476b169")).parameters["default"] = "bfe1e26b-0801-4bd1-86c0-563d8118b609";
                //set the beschreibung not required and disabled
                (this.popUpSchema.elements?.find(element => element.elementId == "65138254-8e1f-4b0b-91ae-70540e468459")).permissions.toEdit = false;
                (this.popUpSchema.elements?.find(element => element.elementId == "65138254-8e1f-4b0b-91ae-70540e468459")).parameters.required = false;
                //set the time field not required and disabled
                (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).permissions.toEdit = false;
                (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).parameters.required = false;
                //when the Urlaub is selected
                if(this.getDataToSave.find(item => item.elementId == "f951c3cf-1594-435e-85be-e951be00bb44")?.data?.text == "95aa87dc-9f80-4c33-8ccd-f59f543bec8e"){
                    //create a date object by the selected date
                    let [day, month, year] = this.getDataToSave.find(item => item.elementId == "d43d0fd0-172d-4b7a-a942-990597d3cb42")?.data?.text.split(".")
                    const tempDate = new Date(year, month - 1, day);
                    //set the default value to the time selecotr
                    (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).parameters.default = this.userMeta.weeklyHours[0].distribution[tempDate.getDay() - 1];
                }
                //if the Krankentag selected set the time field editable 
                if(this.getDataToSave.find(item => item.elementId == "f951c3cf-1594-435e-85be-e951be00bb44")?.data?.text == "33d8cd4d-4684-4408-aa39-9f513b2a186c"){
                    (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).permissions.toEdit = true;
                    (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).parameters.default = "0";
                }
                //if the Zeitausgleich selected reset the time field
                if(this.getDataToSave.find(item => item.elementId == "f951c3cf-1594-435e-85be-e951be00bb44")?.data?.text == "344e3d17-b014-4fb3-a365-883258b31e54"){
                    (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).parameters.default = "reset"
                }
                //console.log(this.popUpSchema)
            } else {
                //reset the props if we set Urlaub to Arbeit
                //reset the project field
                this.popUpSchema.elements.find(element => element.elementId == "30a1d57d-ac51-4a54-9f83-2c493253b944").permissions.toEdit = true;
                delete this.popUpSchema.elements?.find(element => element.elementId == "30a1d57d-ac51-4a54-9f83-2c493253b944").parameters["default"]
                //reset the activity type
                this.popUpSchema.elements.find(element => element.elementId == "9a8284f2-5615-4cb5-893b-56cc3476b169").permissions.toEdit = true;
                delete this.popUpSchema.elements.find(element => element.elementId == "9a8284f2-5615-4cb5-893b-56cc3476b169").parameters["default"]
                //reset beschreibung
                this.popUpSchema.elements.find(element => element.elementId == "65138254-8e1f-4b0b-91ae-70540e468459").permissions.toEdit = true;
                this.popUpSchema.elements.find(element => element.elementId == "65138254-8e1f-4b0b-91ae-70540e468459").parameters.required = true;
                //reset time field
                (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).permissions.toEdit = true;
                (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).parameters.required = true;
                (this.popUpSchema.elements?.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13")).parameters.default = "0";
            }
        },
        updatePoint(){
            this.$apollo.mutate({
				variables: {
					id: this.clickedFile,
					data: this.getDataToSave,
                    schemaId: "3c20a10b-e836-494b-b010-e2a124735ea3"
				},

				mutation: gql`
					mutation (
						$id: String
						$data: JSON
                        $schemaId: String
					) {
						updatePoint (
							id: $id
							data: $data
                            schemaId: $schemaId
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
        createPoint(){
            this.$apollo.mutate({
                variables: {
                    id: this.getValuesToSave.fileId,
                    data: this.getDataToSave,
                    schemaId: this.getValuesToSave.schemaId
                },
                mutation: gql`
                    mutation (
                        $id: String
                        $data: JSON
                        $schemaId: String
                    ) {
                        createPoint (
                            id: $id
                            data: $data
                            schemaId: $schemaId
                        ){
                            id
                        }
                    }
                `
            }).then(data =>{
                this.$emit("saveSuccess")
            })

        },
        createFile(){
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
                // create a new instance to add the file to the directory on every required location
                const directoryWithAddedEntity = new AddEntityToDirectory(
                    this.directory,
                    {
                        fileId: this.getValuesToSave.fileId,
                        label: this.getValuesToSave.label,
                        schemaId: this.getValuesToSave.schemaId,
                        isLeaf: this.popUpSchema?.metadata?.isLeaf
                    },
                    this.getValuesToSave.parentIds)
                // commiting the edited directory to the store
                this.$store.commit('directory/setToStoreDirectory', directoryWithAddedEntity.directoryCopy);
                this.saveDirectory()
            }).catch((error) => {
                console.log({ error })
            })
		},
        //calls the desired function
        selectFunction(functionName){
            this.$store.commit("point/setAutoFillId", undefined)
            this[functionName]();
        },
        //get the clicked file and send it to the components
        searchFile(){
            this.icon = String(this.popUpSchema?.metadata?.icon);
            if(this.clickedFile){
                for(let item of [...this.fileList, ...this.pointList]){
                    if(item.id === this.clickedFile){
                        this.sendDataToInputs = item
                    }
                }   
            }
            
        },
        //getting the parentId from the actual folder
        setParentId(parentId){
            this.$store.commit("file/setParentIdsToEnteredValues", [parentId]);
        },
        getDataFromComponent(data){
           //if the data = name than commit it to the setFileNameToEnteredValues otherwise to the setEnteredData
            if(data.elementId === "75e96f94-0103-4804-abc0-5331ea980e9b") {
                this.$store.commit("file/setFileNameToEnteredValues", data.data.text);
            } else {
                this.$store.commit("file/setEnteredData", data);
            }
        },
        //close the popUp window
        closeNewProject(){
            this.$store.commit("point/setAutoFillId", undefined)
            this.$emit('closeNewProject', false);
        },
        createNewFile(){
            //console.log(this.clickedFile)
            //when clickedFile exists than it will commit the correct elementId, schemaId and parentId
            if(this.clickedFile) {
                this.$store.commit("file/setFileIdToEnteredValues", this.clickedFile);
                this.$store.commit("file/setSchemaIdToEnteredValues", this.popUpSchema.metadata.schemaId);
                this.$store.commit("file/setParentIdsToEnteredValues", this.directory.find(item => item.fileId === this.clickedFile)?.parentId);
            } else {
                //generate new file id for the project
                const newId = uuidv4();
                this.$store.commit("file/setFileIdToEnteredValues", newId);
                //sending the schemaId
                this.$store.commit("file/setSchemaIdToEnteredValues", this.popUpSchema.metadata.schemaId);
            } 
        },
        //updating file and refresh the projektListe
        updateFile() {
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
						updateFile (
							metadata: $metadata
							elementsData: $elementsData
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
        // function to save the changed directory (SUL)
		saveDirectory(){
			this.$apollo.mutate({
				variables: {
					directory: this.directory
				},
				mutation: gql`
					mutation(
						$directory: JSON
					){
						saveDirectory(
							directory: $directory
						){
							id
						}
					}
				`
			}).then(() => {
                this.$emit("saveSuccess")
			}).catch((error) => {
				console.log({ error })
			})
		}
    },
    watch: {
        popUpSchema: {
			deep: true,
			handler () {
                //updating the icon if its available
                this.icon = String(this.popUpSchema?.metadata?.icon);
			}
		},
        getDataToSave:{
            deep: true,
            handler (){
                //run thisfunction if the popUp is Arbeitszeit hinzufügen oder Arbeitstzeit bearbeiten
                if(this.popUpSchema.id == "c519459a-5624-4311-bffb-838d43e7f0d0" || this.popUpSchema.id == "50dd57aa-b759-42e7-9bae-3830cd605f02"){
                    this.isDayTypeHoliday();
                }
            }
        },
        nettoValue:{
            handler(){
                this.setBruttoValue()
            }
        },
        taxValue:{
            handler(){
                this.setBruttoValue()
            }
        }
	}
}

</script>

<style lang="scss" scoped>
$gap-size: 15px;
$columns: 12;

.popUp{
    position: fixed;
    top: 150px;
    left: 15%;
    z-index: 2;
    margin: 30px;
    border-radius: 3px;
    height: auto;
    width: 425px;
    background-color: #4D4D4D;
    justify-content: center;
    text-align: center;
    box-shadow: 25px 25px 40px rgba(0, 0, 0, 0.78), -25px -25px 40px rgba(0, 0, 0, 0.756);
    animation: slideIn 0.2s ease-in;
}
@keyframes slideIn {
  0% {
    opacity: 0;
    //height: 1px;
  }
  100% {
    //height: fit-content;
    opacity: 1;
  }
}
.popUpTop{
    position: relative;
    height: 42px;
    width: 425px;
    background-color:#282828;
    border-start-start-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 8px;
}

.popUpBody{
    padding: 34px 22px;
    animation: slideIn 0.2s ease-in;
}
.addButtonDiv{
    margin-bottom: 20px;
}
.popUpLabellabel{
    font-size: 20px;
}
.closeIcon{
    height:24px;
    width:24px;
}
.closeIcon img{
    width: 100%;
    height:auto;
}
.inputContainer{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: $gap-size;
}
.empty{
    opacity: 0;
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