<template>
    <div class="body">
        <!-- the label of the select input componenet -->
        <div class="label">
            {{label}}
        </div>
        <div class="inputDiv" ref="inputX">
            <!-- the selector loads the select options -->
            <select class="myInput" v-model="inputValue" :disabled="setEditable(permissions.toEdit)" type="text">
                <!-- writing out the optioins -->
                <option
                v-for="(item, index) in files"
                :value="item"
                >{{item}}</option>
            </select>
            <v-icon class="mdi-chevron" v-if="!setEditable(permissions.toEdit)">mdi-chevron-down</v-icon>
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
            }
        }
    },
    methods:{
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
                return !value
            } 
            //if it is not a boolean, than use the checkPermissionIdsHere function to return a value
            else{
                return !this.checkPermissionIdsHere(value);
            }
        },
        setValue(){
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
            this.$emit('update', payload);
        },
        //get the file by the schema of parameters
        getfile() {
            if(this.parameters.default){
                this.inputValue = this.parameters.default;
            }
            //querying the Apotheken of the selectable schema
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
                const temp = data.data.fileBySchemaId;
                this.files = temp.map(
                    function (item, index, array) {
                        return item.data.find(
                            (elementData) => elementData.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0"
                        )?.data?.text;
                    }
                )
            }).catch((error) => {
                console.log({ error });
            });
            //if its not an pharmacy than fills it with the parameters.options from the parent component
            }else if(this.parameters.options)
            {
                this.files = this.parameters.options
            }
        },
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
        this.setValue();
        this.isInputok();
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