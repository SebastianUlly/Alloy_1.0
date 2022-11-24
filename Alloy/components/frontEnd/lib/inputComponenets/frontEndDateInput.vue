<template>
    <div class="body">
        <!-- the label of the input component -->
        <!-- the inputDiv contains the inputfield --> 
       
            <!-- the input becomes the parameters from the parameters prop -->
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto">
            <template v-slot:activator="{ on, attrs }">
            <v-text-field
                class="inputDate"
            
                v-model="date"
                :label="label"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                @input="menu = false"
            ></v-date-picker>
            </v-menu>
            <!-- <input
                :disabled="setEditable(permissions.toEdit)"
                :style="'text-align:' + parameters.align"
                v-model= "inputValue"
                class="myInput"
                type="text"> -->
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { checkPermissionId } from '~/assets/functions/permission'
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
        }
    },
    data(){
        return{
            inputValue:"",
            isInputOkValue: false,
            tempValue: "",
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            menu: false
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
            //checking if the elementId is the id of Number
            if(this.elementIdToSearch && this.elementId !=="75e96f94-0103-4804-abc0-5331ea980e9b" && this.data != undefined){
                this.inputValue = (this.data.data.find(item => item.elementId === this.elementId).data.text)
            }
            else if(this.elementIdToSearch && this.elementId =="75e96f94-0103-4804-abc0-5331ea980e9b" && this.data != undefined){
                this.inputValue = this.data.label
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
                    inputValue = this.tempValue;
                } 
            }
        },
        //sends the payload to the parent
        sendEvent(){
            const payload = {
                elementId: this.elementId,
                data:{
                    text : this.date
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
                
                this.isInputOkValue = false
            }else{
                this.isInputOkValue = true
                
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
            permissionIds: 'authentication/getPermissionIds'
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
.body{
    margin-bottom: 10px;
    position: relative;
}
.inputDate{
    height: 40px;
}
.inputDiv{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.inputDiv:has(.myInput:disabled){
    border-color:gray;
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
.myInput:focus-visible{
    outline: none;
}
.myInput{
    padding: 3px 5px 0 5px;
    width: 100%;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.myInput:disabled{
    color:gray;
}
.label{
    color: white;
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
/* .body:has(.myInput:disabled) .label{
    color: grey;
} */
</style>