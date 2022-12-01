<template>
    <div class="timeInputMain">
        <!-- the label of the input component -->
        <div class="label">
           Std
        </div>
        <!-- the inputDiv contains the timeInputs and the ":" --> 
        <div
            class="timeInputBackgroundDiv"
            ref="timeInput">
            <!-- the hours input -->
            <input
                :disabled="setEditable(permissions.toEdit)"
                :style="'text-align:' + parameters.align"
                v-model= "inputValueHour"
                class="timeInput"
                min="0"
                type="number">
        </div>
        <!-- ":" in the middle -->
        <div class="middle"> : </div>
        <!-- the minutes div -->
        <div class="labelTwo">
           Min
        </div>
        <div
            class="timeInputBackgroundDiv"
            ref="timeInput">
            <!-- the minutes input -->
            <input
                :disabled="setEditable(permissions.toEdit)"
                :style="'text-align:' + parameters.align"
                v-model= "inputValueMinutes"
                class="timeInput"
                min="0"
                max="45"
                step="15"
                type="number">
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
            inputValueHour:"00",
            inputValueMinutes:"00",
            isInputOkValue: false,
            tempValue: ""
        }
    },
    methods:{
        setDefaultValue(){
            if(this.elementIdToSearch && this.data != undefined){
                const [hour, minute] = this.data.data.find(item => item.elementId === this.elementId).data.text.split(':')
                this.inputValueHour = hour,
                this.inputValueMinutes = minute
            }   
        },
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
        //sends the payload to the parent
        sendEvent(){
            const payload = {
                elementId: this.elementId,
                data:{
                    text : this.inputValueHour + ":" + this.inputValueMinutes
                }
            }
            this.$emit('update', payload);
        },
        //checks if the parameters.required are true and if so, makes the frame of the inputfield red
        //sending with an event to the parent componenet if the field  is filled or not
        isInputOk(){
            //if the input value is empty and the input is required
            if(this.inputValue === "" && this.parameters.required){
                //then add the selectError class on the input
                this.$refs.timeInput.classList.add("timeInputError");
                //and sets the isUnputOkValue flase
                this.isInputOkValue = false
            }else{
                //else delete the class from the input and set the isInputOkValue true
                this.isInputOkValue = true
                this.$refs.timeInput.classList.remove("timeInputError");
            }
            //at the end create the temp payload with the elementId and with the isInputOkValue
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
            /* directory : "directory/getDirectory", */
            permissionIds: 'authentication/getPermissionIds'
        })
    },
     watch: {
        inputValueHour:{
            handler(){
                this.isInputOk();
                this.sendEvent();
            }
        },
        inputValueMinutes:{
            handler(){
                this.isInputOk();
                this.sendEvent();
            }
        }
    } 
}
</script>
<style scoped>
.timeInputMain{
    margin-bottom: 10px;
    position: relative;
}
.middle{
    margin: 3px 3px 0 3px;
}
.timeInputBackgroundDiv{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 50%;
}
.timeInputBackgroundDiv:has(.timeInput:disabled){
    border-color:gray;
}
.timeInputError{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(153, 0, 0);
    border-width: thin;
    border-radius: 3px;
    width: 50%;
}
.timeInputBackgroundDiv:focus-visible{
    outline: none;
}
.timeInput{
    padding: 3px 5px 0 5px;
    width: 100%;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.timeInput:disabled{
    color:gray;
}
.label{
    color: white;
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
.labelTwo{
    color: white;
    position:absolute;
    left: 70px;
    top: -15px;
    font-size: 11px;
}
</style>