<template>
    <div class="selectInputMain">
        <!-- the label of the select input componenet -->
        <div class="label">
            {{label}}
        </div>
        <!-- {{ inputValue }} -->
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
                    >{{item.year}}-{{item.projectNumber}}-{{item.pharmacy}}-{{item.projectName}}</option>
                    <!-- options if the source comes from the database -->
                    <option
                        v-if="optionsFromDatabase"
                        v-for="(item, index) in optionsFromDatabase"
                        :value="item"
                    >{{item}}</option>
                </select>
                <!-- dropdown arrow -->
                <v-icon class="mdi-chevron" v-if="editable">mdi-chevron-down</v-icon>
                <v-progress-linear
                    v-if="loadingFiles"
                    indeterminate
                    color="green"
                    :rounded="true"
                ></v-progress-linear>
            </div>
            {{ inputValue }}
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
        clickedFileId:{
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
            optionsFromDatabase:[],
            listOfAllPharmacies: [],
            hashMapOfAllPharmacies: {},
            loadingFiles: false
        }
    },

    created(){
        this.setEditable();
        this.setDefaultValue();
    },

    mounted(){
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
            directory: 'directory/getDatabaseDirectory',
            autoFillId: 'point/getAutoFillId',
            projectsFromStore: 'file/getProjectList'
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
        },
        data:{
            deep:true,
            handler(){
                this.setDefaultValue()
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
        async setEditableByProject(value){
            const result = await this.$apollo.query({
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
            })
            this.files = []
            this.options = []
            this.optionsFromDatabase = []
            this.filesFromMiscellaneous = await this.getPharmacyById(result.data.queryFileData.data.find(element => element.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text)
            if(this.filesFromMiscellaneous.length > 1){
                this.editable = true
            } else {
                this.editable = false
            }
            this.inputValue = result.data.queryFileData.data.find(element => element.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text
            this.setDefaultValue()
        },
        async getPharmacyById(id){
            if (this.hashMapOfAllPharmacies[id]) {
                const pharm = this.hashMapOfAllPharmacies[id]
                if (pharm.schemaId === '961fe75d-2d0e-4ccb-8afd-cde072b37380'){
                    return [pharm]
                } else if (pharm.schemaId === '7c70a676-ef00-432c-bce0-60f7c8b6fb0b') {
                    let tempPharmacyList = []
                    tempPharmacyList.push(pharm)
                    for (let pharmacyId of pharm.data.find(element => element.elementId === '09c5ba61-4e52-4a68-afde-bb7334b45b35').data.values) {
                        tempPharmacyList.push((await this.getPharmacyById(pharmacyId))[0])
                    }
                    return tempPharmacyList
                }
            } else {
                const result = await this.$apollo.query({
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
                })
                this.hashMapOfAllPharmacies[id] = {
                    name: result.data.queryFileData.data.find(data => data.elementId === '91f42e63-98b4-462b-bf65-58b416718cb0').data.text,
                    id: result.data.queryFileData.id,
                    schemaId: result.data.queryFileData.schemaId,
                    data: result.data.queryFileData.data
                }
                if (result.data.queryFileData.schemaId === "961fe75d-2d0e-4ccb-8afd-cde072b37380"){
                    return [{
                        name: result.data.queryFileData.data.find(data => data.elementId === '91f42e63-98b4-462b-bf65-58b416718cb0').data.text,
                        id: result.data.queryFileData.id,
                        schemaId: result.data.queryFileData.schemaId,
                        data: result.data.queryFileData.data
                    }]
                } else if (result.data.queryFileData.schemaId === '7c70a676-ef00-432c-bce0-60f7c8b6fb0b') {
                    let tempPharmacyList = []
                    tempPharmacyList.push({
                        name: result.data.queryFileData.data.find(data => data.elementId === '91f42e63-98b4-462b-bf65-58b416718cb0').data.text,
                        id: result.data.queryFileData.id,
                        schemaId: result.data.queryFileData.schemaId,
                        data: result.data.queryFileData.data
                    })
                    for (let pharmacyId of result.data.queryFileData.data.find(element => element.elementId === '09c5ba61-4e52-4a68-afde-bb7334b45b35').data.values) {
                        tempPharmacyList.push((await this.getPharmacyById(pharmacyId))[0])
                    }
                    return tempPharmacyList
                }
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
            //if clickedFileId and this element is not the Number, set the default value from the database
            if(this.clickedFileId && this.data != undefined){
                this.inputValue = this.data.data.find(item => item.elementId === this.elementId).data.text
            }
        },
        //sending the selected data to the store
        sendEvent(){
            let payload = {
                data:{
                    text : this.inputValue
                },
                elementId: this.elementId
            }
            
            //if the elementId is from the project select then emitting the payloads data
            if(payload.elementId === "30a1d57d-ac51-4a54-9f83-2c493253b944"){
                this.$root.$emit('sendSelectedProject', payload);
            }
            this.$emit('update', payload);
        },
        getPharmNameByIdForSingleId (id) {
            this.$apollo.query({
                variables:{
                    fileId: id
                },
                query: gql`
                    query ($fileId: String) {
                        queryFileData(id: $fileId){
                            label
                        }
                    }
                
                `
            }).then((data) => {
            return data.data.queryFileData.label
            }).catch((error) => {
            console.log({ error })
            })
        },
        //get the file by the schema of parameters
        async getfile() {
            if(this.parameters.default){
                this.inputValue = this.parameters.default;
            }
            //querying the pharmacies of the selectable schema
            if(this.parameters?.selectableSchema){
                for(let schemaId of this.parameters?.selectableSchema){
                    this.getPharmacyBySchemaId(schemaId)
                }
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
        getProjectsFromStore () {
            for (const project of this.projectsFromStore) {
                if(this.directory[0]?.hierarchy.some(e => e.fileId === project.id) && project.schemaId === '44111b55-c2b8-4e30-97d3-452aed86c1f4'){
                    this.filesProject.push({
                        id: project.id,
                        year: project.data.find(element => element.elementId === "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                        pharmacy: project.data.find(element => element.elementId === "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text,
                        projectNumber: project.label,
                        projectName: project.data.find(element => element.elementId === "5187f38c-c1b7-4f8e-9c00-b87f703650ee").data.text
                    })
                }
                if (this.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35") {  
                    //if the current selectInput is the pharmacy selector
                    console.log('asd')
                    this.files.push({
                        id: project.id,
                        label: project.data.find(element => element.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0").data.text
                    })
                }
            }
            this.sortFilesProject()
        },
        async getPharmacyBySchemaId (schemaId) {
           
            const result = await this.$apollo.query({
            variables: {
                schemaId: schemaId
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
        })   
            //if the current seectInput is the pharmacy selecotr
            if(this.elementId === '09c5ba61-4e52-4a68-afde-bb7334b45b35' && !this.autoFillId){
                for(const pharmacy of result.data.fileBySchemaId){
                    this.files.push({
                        id: pharmacy.id,
                        label: pharmacy.data.find(element => element.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0").data.text
                    })
                }
            }
            //if the current selectInput is not the pharmacy selector
            if(this.elementId !== "09c5ba61-4e52-4a68-afde-bb7334b45b35" && !this.autoFillId){
                this.getProjectsFromStore()

                /*  this.loadingFiles = true
                 console.log(this.directory[0]?.hierarchy)
                for (const file of result.data.fileBySchemaId) {
                    if(this.directory[0]?.hierarchy.some(e => e.fileId === file.id)){
                        const pharmacy = await this.getPharmacyById(file.data.find(element => element.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35").data.text)
                        const pharmacyAbb = pharmacy[0].name
                        this.filesProject.push({
                            id: file.id,
                            year: file.data.find(element => element.elementId === "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                            pharmacy: pharmacyAbb,
                            projectNumber: file.label,
                            projectName: file.data.find(element => element.elementId === "5187f38c-c1b7-4f8e-9c00-b87f703650ee").data.text
                        })
                    }
                    if (this.elementId == "09c5ba61-4e52-4a68-afde-bb7334b45b35") {  
                        //if the current selectInput is the pharmacy selector
                        for(const pharmacy of result.data.fileBySchemaId){
                            this.files.push({
                                id: pharmacy.id,
                                label: pharmacy.data.find(element => element.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0").data.text
                            })
                        }
                    }
                    //run the sort files function that sort the filesProject array
                    this.sortFilesProject()
                } */
                this.loadingFiles = false
            } else if (this.elementId !== "09c5ba61-4e52-4a68-afde-bb7334b45b35" && this.autoFillId){
                this.options = []
                // //when the autofillId exists limit the options just with one file
                const autoFillFile = result.data.fileBySchemaId.find(file => file.id === this.autoFillId)
                
                this.options.push({
                    id: autoFillFile.id,
                    year: autoFillFile.data.find(element => element.elementId === "577aa568-345a-47e5-9b71-848d5695bd5d").data.text,
                    projectNumber: autoFillFile.label,
                    projectName: autoFillFile.data.find(element => element.elementId === "5187f38c-c1b7-4f8e-9c00-b87f703650ee").data.text
                })
                this.inputValue = autoFillFile.id
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