<template>
    <div class="inputMain">
        <!-- the label of the input component -->
        <div class="label">
           {{label}}
        </div>
        <!-- the inputDivBackground contains the inputfield --> 
        <div
            class="inputDivBackground"
            ref="inputDiv"
        >
            <!-- the input becomes the parameters from the parameters prop -->
            <input
                v-if="displayValue"
                :disabled="setEditable(permissions.toEdit)"
                :style="'text-align:' + parameters.align"
                :value="displayValue"
                class="input"
                type="text"
            >
            <!-- the input becomes the parameters from the parameters prop -->
            <input
                v-else
                :disabled="setEditable(permissions.toEdit)"
                :style="'text-align:' + parameters.align"
                v-model="inputValue"
                class="input"
                type="text"
            >
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { checkPermissionId } from '~/assets/functions/permission'
import gql from "graphql-tag"
export default{
    props: {
        elementId:{
            type: String
        },
        label:{
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
        },
        selectedUserId:{
            type: String
        }
    },
    data(){
        return{
            inputValue: '',
            displayValue: '',
            isInputOkValue: false,
            tempValue: ''
        }
    },
    methods:{
        //checks if the permissionId is in the permissionIds list and sends the permissionId to the checkPermissionId function
        checkPermissionIdsHere (arg) {
			if (this.permissionIds) {
				return checkPermissionId(this.permissionIds, arg)
                
			}
			return false
		},
        //check if the permissions.toEdit is a boolean or a permissionId
        setEditable(value){ 
            if(typeof value === "boolean"){
                return !value
            } 
            //if it is not a boolean, than use the checkPermissionIdsHere function to return a value
            else{
                return !this.checkPermissionIdsHere(value);
            }
        },
        //checking the database default value
        setDefaultValue(){
            //checking if the elementId is not the id of Number
            if(this.elementIdToSearch && this.elementId !=="75e96f94-0103-4804-abc0-5331ea980e9b" && this.data != undefined){
                // clicking on the time edit icon will not display the data from the database but the full name of the logged in user
                if(this.parameters.default == "currentUser" && this.elementIdToSearch){
                    //if the admin select someone else from the user selector
                    if(this.selectedUserId !== this.userId){
                        this.$apollo.query({
                            query: gql`
                                query {
                                    getAllUser {
                                        userId
                                        data
                                    }
                                }
                            `
                        }).then((data)=>{
                            const temp = data.data.getAllUser.find(currentUser => currentUser.userId == this.selectedUserId)
                            const firstName = temp.data.find(userData => userData.elementId == "2d1b9f45-61f4-438d-b682-734000022169").data.text
                            const lastName = temp.data.find(userData => userData.elementId == "7b990f61-122c-4d14-a234-34bd32472c63").data.text
                            this.displayValue = firstName + " " + lastName;
                            this.inputValue = this.selectedUser;
                        })
                    }
                    //if the admin select itself with the user selector
                    else {
                        this.displayValue = this.userMeta.firstName + " " + this.userMeta.lastName
                        this.inputValue = this.userId
                    }
                    //this.displayValue = this.userMeta.firstName + " " + this.userMeta.lastName
                }
                for(let item of this.data.data){
                    if(item.elementId == this.elementId){
                        this.inputValue = item.data.text
                    }
                } 
                //this.inputValue = (this.data.data.find(item => item.elementId === this.elementId).data.text)
            }
            else if(this.elementIdToSearch && this.elementId =="75e96f94-0103-4804-abc0-5331ea980e9b" && this.data != undefined){
                this.inputValue = this.data.label
            }
            else if (this.parameters.default === "currentUser"){
                //if the admin select someone else from the user selector
                console.log(this.selectedUser)
                if(this.selectedUserId !== this.userId && this.selectedUser){
                    this.$apollo.query({
                        query: gql`
                            query {
                                getAllUser {
                                    userId
                                    data
                                }
                            }
                        `
                    }).then((data)=>{
                        const temp = data.data.getAllUser.find(currentUser => currentUser.userId == this.selectedUserId)
                        const firstName = temp.data.find(userData => userData.elementId == "2d1b9f45-61f4-438d-b682-734000022169").data.text
                        const lastName = temp.data.find(userData => userData.elementId == "7b990f61-122c-4d14-a234-34bd32472c63").data.text
                        this.displayValue = firstName + " " + lastName;
                        this.inputValue = this.selectedUser;
                    })
                }
                //if the admin select itself with the user selector
                else {
                    this.displayValue = this.userMeta.firstName + " " + this.userMeta.lastName
                    this.inputValue = this.userId
                }
            }
            //if the default value is currentYear, set the defaultValue to the current year
            else if(this.parameters.default === "currentYear"){    
                this.inputValue = new Date().getFullYear().toString();
            }
            //if the defaultValue consecutiveNumber, find the previous largest number of projects and add one
            else if(this.parameters.default === "consecutiveNumber" &&  this.directory && !this.elementIdToSearch){
                let currentFolderId = "";
                for(let item of this.directory){
                     if(item.name == new Date().getFullYear()){
                        currentFolderId = item.id;
                        this.$emit('getCurrentFolderId', item.id)
                    }
                }
                //tempArray is a filtered array that contains the projects with the actual year
                const tempArray = this.directory.filter(item => item.parentId === currentFolderId)
                let tempArrayInt = [];
                //converting the strings to Int for the mathMax function
                for(let i = 0; i < tempArray.length; i++){
                    tempArrayInt.push(parseInt(tempArray[i].name))
                }
                //search for the biggest number
                let tempValueInt = Math.max(...tempArrayInt)
                //adding one to the biggest number and converts back to string
                this.tempValue = (++tempValueInt).toString()
                //adding the 0 and 00 to reach the desired format
                if(this.tempValue.length == 2){
                    this.inputValue = "0" + this.tempValue;
                }else if(this.tempValue.length == 1){
                    this.inputValue = "00" + this.tempValue;
                } else{
                    this.inputValue = this.tempValue;
                }
                this.sendEvent();
            }
        },
        //sends the payload to the parent
        sendEvent(){
            const payload = {
                elementId: this.elementId,
                data:{
                    text : this.inputValue
                }
            }
            if(this.parameters.required){
                
            }
            this.$emit('update', payload);
        },
        //checks if the parameters.required are true and if so, makes the frame of the inputfield red
        //sending with an event to the parent componenet if the field  is filled or not
        isInputOk(){
            if(this.inputValue === "" && this.parameters.required){
                this.$refs.inputDiv.classList.add("inputError");
                this.isInputOkValue = false
            }else{
                this.isInputOkValue = true
                this.$refs.inputDiv.classList.remove("inputError");
            }
            let tempPayload = {
                elementId: this.elementId,
                value: this.isInputOkValue
            }
            //sending the elementId and the value to the store
            this.$store.commit('file/setIsInputOk', tempPayload)   
        }
    },
    created(){
        this.setDefaultValue();
        this.setEditable();
    },
    mounted() {
        this.isInputOk();
    },
    computed:{
        ...mapGetters({
            directory : "directory/getDirectory",
            permissionIds: 'authentication/getPermissionIds',
            userId: 'authentication/getUserId',
            userName: 'authentication/getUserName',
            userMeta: 'authentication/getUserMeta'
        })
    },
     watch: {
        direcotry:{
            deep: true,
            handler(){
                this.setDefaultValue();
            }
        },
        inputValue:{
            handler(){
                this.isInputOk();
                this.sendEvent();
            }
        }
    } 
}
</script>
<style scoped>
.inputMain{
    margin-bottom: 10px;
    position: relative;
    width:100%;
}
.inputDivBackground{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.inputDivBackground:has(.input:disabled){
    border-color:gray;
}
.inputError{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(153, 0, 0);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.input:focus-visible{
    outline: none;
}
.input{
    padding: 3px 5px 0 5px;
    width: 100%;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.input:disabled{
    color:gray;
}
.label{
    color: white;
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
</style>