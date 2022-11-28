<template>
    <div class="body">
        <!-- the label of the select input componenet -->
        <div class="label">
            {{label}}
        </div>
        <div class="inputDiv" ref="inputX">
            <!-- the selector loads the select options -->
            <select class="myInput" v-model="inputValue" :disabled="!editable" type="text">
                <!-- writing out the optioins -->
                <option
                    v-if="files"
                    v-for="(item, index) in files"
                    :value="item"
                >{{item}}</option>
                <option
                    v-if="filesFromMiscellaneous"
                    v-for="(item, index) in filesFromMiscellaneous"
                    :value="item.id"
                >{{item.name}}</option>
                <option
                    v-if="filesProject"
                    v-for="(item, index) in filesProject"
                    :value="item.id"
                >{{item.year}}-{{item.projectNumber}}</option>
            </select>
            <v-icon class="mdi-chevron" v-if="editable">mdi-chevron-down</v-icon>
        </div>
        <!-- dropdown arrow -->
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
            editable: true
        }
    },
    apollo:{
        directory: gql `
			query egal{
				directory{
					id
					hierarchy
				} 
			}
		`
    },
    methods:{
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
                //console.log(data.data.queryFileData, "data?")
                this.getPharmacyId(data.data.queryFileData.data.find(data => data.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text)
             })

             /* if(value?.data?.text === "d86517b2-7b7b-43d6-aec2-577d1c81dd7b"){
                this.editable = true
                console.log(value.data.text, this.elementId, this.editable, "inside");

            } */
        },
        getPharmacyId(pharmacyId){
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
                this.filesFromMiscellaneous = []
                if(data.data.queryFileData.schemaId == "961fe75d-2d0e-4ccb-8afd-cde072b37380"){
                    this.editable = false;
                    this.inputValue = pharmacyId
                    this.filesFromMiscellaneous.push({name: data.data.queryFileData.data[0].data.text, id: pharmacyId})
                    //this.getPharmacyNameById()
                } else {
                    if(data.data.queryFileData.schemaId == "7c70a676-ef00-432c-bce0-60f7c8b6fb0b"){
                        this.filesFromMiscellaneous.push({name:data.data.queryFileData.data.find(item => item.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0").data.text, id: pharmacyId})
                        this.inputValue = pharmacyId
                        this.getPharmacyNameById(data.data.queryFileData.data.find(data => data.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.values)
                        this.editable = true;
                    }
                }
             })
        },
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
            //if it is not a boolean, than use the checkPermissionIdsHere function to return a value
            if(typeof value === "string"){
                this.editable = this.checkPermissionIdsHere(value);
            }
        },
        setValue(){
            //if elementIdToSearch and this element is not the Number, set the default value from the database
            if(this.elementIdToSearch && this.elementId !=="75e96f94-0103-4804-abc0-5331ea980e9b" && this.data != undefined){
                this.inputValue = (this.data.data.find(item => item.elementId === this.elementId).data.text)
            }   
        },
        //sending the selected data to the store
        sendEvent(){
            const payload = {
                elementId: this.elementId,
                data:{
                    text : this.inputValue
                } 
            }
            if(payload.elementId === "90bd2ecc-38e1-4bf4-bffa-cc7d15b8f323"){
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
                        
                           // 90bd2ecc-38e1-4bf4-bffa-cc7d15b8f323
                        
                        if (isNaN(parseFloat(data.data.fileBySchemaId[1].label)) && data.data.fileBySchemaId[1].label !== "BOCOM"){
                            const temp = data.data.fileBySchemaId;
                            this.files = temp.map(
                                function (item, index, array) {
                                    return item.data.find(
                                        (elementData) => elementData.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0"
                                    )?.data?.text;
                                }
                            )
                        } else {
                            for(const item of data?.data?.fileBySchemaId){
                                if(this.directory[0].hierarchy.some(e => e.fileId === item.id)){
                                    console.log(item)
                                    this.filesProject.push({
                                        id: item.id,
                                        year: item.data.find(element => element.elementId === "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                                        projectNumber: item.label
                                    })
                                }
                            }

                        }

                }).catch((error) => {
                    console.log({ error });
                });
            //if its not an pharmacy than fills it with the parameters.options from the parent component
            }else if(this.parameters.options) {
                this.files = this.parameters.options
            }
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
            if(this.inputValue === "" && this.parameters.required){
                this.$refs.inputX.classList.add("myInputError");
                isInputOkValue = false;
            }
            else {
                isInputOkValue = true;
                this.$refs.inputX.classList.remove("myInputError");
            }
            let tempPayload = {
                elementId: this.elementId,
                value: isInputOkValue
            }
            this.$store.commit('file/setIsInputOk', tempPayload)
        }
    },
    created(){
        this.setEditable();
    },
    computed:{
        ...mapGetters({
            permissionIds: 'authentication/getPermissionIds'
        })
    },
    mounted(){
        this.getfile();
        this.isInputok();
        this.setEditable(this.permissions.toEdit)
        if(this.elementId === "0e2e7998-16ab-4262-9dfe-4137760b0460"){
            this.$root.$on('sendSelectedProject', data => {this.setEditableByProject(data)})
        }
    },
    watch:{
        //if the input value changes calls the sendEvent
        inputValue:{
            handler(){
                this.sendEvent();
                this.isInputok();
            }
        }
    }
}
</script>
<style scoped>
.body{
    margin-bottom: 10px;
    position: relative;
    width:100%;
}
.inputDiv{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(255, 255, 255);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.myInput:focus-visible{
    outline: none;
}
.myInput{
    width: 100%;
    padding-left: 10px;
    padding-top: 4px;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.myInputError{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(153, 0, 0);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.myInput:disabled{
    color:gray;
}
.inputDiv:has(.myInput:disabled){
    border-color:gray;
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