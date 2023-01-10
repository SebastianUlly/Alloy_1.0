<template>
    <div class="selectInputMain">
        <!-- the label of the select input componenet -->
        <div class="label">
            {{label}}
        </div>
        <div class="selectInputDivBackground" ref="input">
            <!-- the selector loads the select options -->
            <div class="wrapper">
                <select class="select" v-model="inputValue" :disabled="!editable" type="text" >
                <!-- writing options depending on which function is running -->
                <option
                    v-if="files"
                    v-for="(item, index) in files"
                    :value="item.id"
                >{{item.label}}</option>
                <!-- options from the miscellaneous or from getPharmacyByName() function -->
                <option
                    v-if="filesFromMiscellaneous"
                    v-for="(item, index) in filesFromMiscellaneous"
                    :value="item.id"
                >{{item.name}}</option>
                <!-- options for the select project comes from getFile function -->
                <option
                    v-if="options"
                    v-for="(item, index) in options"
                    :value="item.id"
                >{{item.year}}-{{item.projectNumber}}</option>
                <!-- options if the source comes from the database -->
                <option
                    v-if="optionsFromDatabase"
                    v-for="(item, index) in optionsFromDatabase"
                    :value="item"
                >{{item}}</option>
            </select>
            <!-- dropdown arrow -->
            <v-icon class="mdi-chevron" v-if="editable">mdi-chevron-down</v-icon>
            </div> 
        </div>
    </div>
</template>
<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
import { checkPermissionId } from '~/assets/functions/permission'
export default{
    props: {
        elementId: {
            type: String
        },
        label: {
            type: String
        },
        parameters:{
            type: Object
        },
        elementIdToSearch:{
            type: String
        },
        data:{
            type: Object
        },
        permissions:{
            type: Object
        }
    },
    data(){
        return{
            files:[],
            inputValue: "",
            chevronStyle:{
                color: 'white',
                right: '10px',
                top: '4px',
            },
            filesFromMiscellaneous:[],
            filesProject:[],
            editable: true,
            options:[],
            optionsFromDatabase:[]
        }
    },

    created(){
        this.setEditable();
        this.setDefaultValue();
    },

    mounted(){
        //console.log(this.elementId)
        this.getfile();
        this.isInputok();
        this.setEditable(this.permissions.toEdit)
        //if the component is the company selector then listen to the emit and sends the payloads data to the function
        if(this.elementId === "0c9cf456-edc3-4779-b00c-14237863fa16"){
            this.$root.$on('sendSelectedProject', data => {this.setEditableByProject(data)})
        }
    },
    
    computed:{
        ...mapGetters({
            permissionIds: 'authentication/getPermissionIds',
            directory: 'directory/getDatabaseDirectory'
        })
    },

    watch:{
        //if the input value changes calls the sendEvent
        inputValue:{
            handler(){
                this.sendEvent();
                this.isInputok();
            }
        },
        permissions:{
            deep: true,
            handler(){
                this.setEditable(this.permissions.toEdit);
                this.getfile(this.parameters.default);
            }
        }
    },
    
    methods:{
        //sort and get the youngest 10 element of the projects
        sortFilesProject(){
            let sortedProjects = this.sortFunction(this.filesProject)
            this.options = sortedProjects
        },
        //soting the options first by year and than by project number
        sortFunction(array){
            //not sure if it will always work at the edge of end of year and begin of year 
            array.sort(function(a, b){
                if(parseInt(a.year) < parseInt(b.year)){
                    return 1
                } else if(parseInt(a.year) > parseInt(b.year)){
                    return -1
                }

                if(parseInt(a.projectNumber) < parseInt(b.projectNumber)){
                    return 1
                } else if(parseInt(a.projectNumber) > parseInt(b.projectNumber)){
                    return -1
                }
                return 0
            })
            return array
        },
        //function that call getPharmacyId with the pharmacyId of selected project
        setEditableByProject(value){
             this.$apollo.query({
                variables:{
                    fileId: value.data.text
                },
                query: gql`
                    query ($fileId: String) {
                        queryFileData(id: $fileId){
                            id
                            label
                            data
                            schemaId
                        }
                    }
                
                `
             }).then(data => {
                this.getPharmacyById(data.data.queryFileData.data.find(data => data.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text)
             })
        },
        //querying the pharmacy 
        getPharmacyById(pharmacyId){
            this.$apollo.query({
                variables:{
                    fileId: pharmacyId
                },
                query: gql`
                    query ($fileId: String) {
                        queryFileData(id: $fileId){
                            id
                            label
                            data
                            schemaId
                        }
                    }
                
                `
             }).then(data => {
                //reseting the filesFromMiscellaneous
                this.filesFromMiscellaneous = []
                //if the schemaId is 961fe75d-2d0e-4ccb-8afd-cde072b37380 (this is the schemaId of single pharmacy) set the editable false
                if(data.data.queryFileData.schemaId == "961fe75d-2d0e-4ccb-8afd-cde072b37380"){
                    this.editable = false;
                    //sets the inputValue to this pharmacy
                    this.inputValue = pharmacyId
                    this.filesFromMiscellaneous.push({name: data.data.queryFileData.data[0].data.text, id: pharmacyId})
                } else {
                    //if the schemaId is an id of pharmacyGroup
                    if(data.data.queryFileData.schemaId == "7c70a676-ef00-432c-bce0-60f7c8b6fb0b"){
                        //set the edatable true and send the ids of pharmacies to the getPharmacyNameById function
                        this.filesFromMiscellaneous.push({name:data.data.queryFileData.data.find(item => item.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0").data.text, id: pharmacyId})
                        this.inputValue = pharmacyId
                        this.getPharmacyNameById(data.data.queryFileData.data.find(data => data.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.values)
                        this.editable = true;
                    }
                }
             })
        },
        //search the pharmacy name by id and push to the files from miscellaneous
        getPharmacyNameById(ids){
            for(let id of ids){
                this.$apollo.query({
                variables:{
                    fileId: id
                },
                query: gql`
                    query ($fileId: String) {
                        queryFileData(id: $fileId){
                            id
                            label
                            data
                            schemaId
                        }
                    }
                
                `
             }).then(data => {
                this.filesFromMiscellaneous.push({name: data.data.queryFileData.data.find(data => data.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0").data.text, ids})
             })
            }
            

        },
        //checks if the permissionId is in the permissions list and sends the permissionId to the checkPermissionId function
        checkPermissionIdsHere (arg) {
			if (this.permissionIds) {
				return checkPermissionId(this.permissionIds, arg)
			}
			return false
		},
         //check if the permissions.toEdit is a boolian or a permissionId
        setEditable(value){
            if(typeof value === "boolean"){
                this.editable = value
            } 
            //if it is not a boolean, then use the checkPermissionIdsHere function to return a value
            if(typeof value === "string"){
                this.editable = this.checkPermissionIdsHere(value);
            }
        },
        setDefaultValue(value){

            //if elementIdToSearch and this element is not the Number, set the default value from the database
            if(this.elementIdToSearch && this.data != undefined){
                this.inputValue = (this.data.data.find(item => item.elementId === this.elementId).data.text)
            }   
        },
        //sending the selected data to the store
        sendEvent(){
            let payload = {
                elementId: this.elementId,
                data:{
                    text : this.inputValue
                } 
            }
            //if the elementId is from the project select then emitting the payloads data
            if(payload.elementId === "30a1d57d-ac51-4a54-9f83-2c493253b944"){
                this.$root.$emit('sendSelectedProject', payload);
            }
            this.$emit('update', payload);
        },
        //get the file by the schema of parameters
        getfile() {
            if(this.parameters.default){
                this.inputValue = this.parameters.default;
            }
            //querying the pharmacies of the selectable schema
            if(this.parameters?.selectableSchema){
                this.$apollo.query({
                    variables: {
                        schemaId: this.parameters?.selectableSchema,
                    },
                    query: gql`
                        query ($schemaId: String) {
                            fileBySchemaId(schemaId: $schemaId) {
                                id
                                label
                                data
                            }
                        }
                    `,
                //filling the files array with the data of fileBySchemaId.data where elementData.elementId (name field of an apotheke) is the same
                }).then((data) => {
                    //if the current selectInput is not the pharmacy selector
                    if(this.elementId !== "09c5ba61-4e52-4a68-afde-bb7334b45b35"){
                        for (const file of data.data.fileBySchemaId) {
                            if(this.directory[0]?.hierarchy.some(e => e.fileId === file.id)){
                                this.filesProject.push({
                                    id: file.id,
                                    year: file.data.find(element => element.elementId === "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                                    projectNumber: file.label
                                })
                            }
                        }
                        //if the current selectInput is the pharmacy selector
                    } else if (this.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35") {
                        for(const pharmacy of data.data.fileBySchemaId){
                            this.files.push({
                                id: pharmacy.id,
                                label: pharmacy.data[0].data.text
                            })
                        }
                    }
                    //run the sort files function that sort the filesProject array
                    this.sortFilesProject()
                    // //if the first file from query has a label with number
                    /* if (isNaN(parseFloat(data.data.fileBySchemaId[1].label)){
                         const temp = data.data.fileBySchemaId;
                         console.log('kjalsd')
                         this.files = temp.map(
                             function (item, index, array) {
                                 return item.data.find(
                                    (elementData) => elementData.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0"
                                 )?.data?.text;
                             }
                         )
                     } else {
                         for(const item of data?.data?.fileBySchemaId){
                             //if the project not deleted
                             if(this.directory[0].hierarchy.some(e => e.fileId === item.id)){
                                 this.filesProject.push({
                                     id: item.id,
                                     year: item.data.find(element => element.elementId === "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                                     projectNumber: item.label
                                 })
                             }
                         }

                     } */

                }).catch((error) => {
                    console.log({ error } );
                });
            //if its not an pharmacy then fills it with the parameters.options from the parent component
            }else if(this.parameters.options) {
                this.optionsFromDatabase = this.parameters.options
            }
            //if the parameters.optionSource exist query the miscellaneous by the option source id
            else if(this.parameters?.optionSource){
                this.$apollo.query({
					variables:{
						id: this.parameters.optionSource
					},
					query: gql`
						query($id: String){
							miscellaneousById( id: $id){
								id
								label
								data
							}
						}
					`
				}).then((data) => {
                  this.filesFromMiscellaneous = data.data.miscellaneousById.data
                })
            }
        },
        //isInputOk a function that changes the color of an input and sets the save button available
        isInputok(){
            let isInputOkValue = false;
            //if the input value is empty and the input is required
            if(this.inputValue === "" && this.parameters.required){
                //then add the selectError class on the input
                this.$refs.input.classList.add("selectError");
                //and sets the isInputOkValue false
                isInputOkValue = false;
            }
            //else delete the class from the input and set the isInputOkValue true
            else {
                isInputOkValue = true;
                this.$refs.input.classList.remove("selectError");
            }
            //at the end create the temp payload with the elementId and with the isInputOkValue
            let tempPayload = {
                elementId: this.elementId,
                value: isInputOkValue
            }
            //emit the payload to the popUp component
            this.$store.commit('file/setIsInputOk', tempPayload)
        }
    }
}
</script>
<style scoped>
.selectInputMain{
    margin-bottom: 10px;
    position: relative;
    width:100%;
}
.selectInputDivBackground{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(255, 255, 255);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.select:focus-visible{
    outline: none;
} 
.select{
    width: 100%;
    padding-left: 10px;
    padding-top: 4px;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.selectError{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(153, 0, 0);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.select:disabled{
    color:gray;
}
.label{
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
option{
    background-color:#282828;
    color: white;
}
.mdi-chevron{
    color:white;
    position: absolute;
    right: 10px;
    top: 4px;
    pointer-events: none;
}
</style>