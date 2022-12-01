<template>
    <div class="textAreaMain">
        <!-- the label of the input component -->
        <div class="label">
           {{label}}
        </div>
        <!-- the inputDiv contains the textArea --> 
        <div
            class="inputDiv"
            ref="textArea">
            <!-- text area -->
            <textarea
                :disabled="setEditable(permissions.toEdit)"
                :style="'text-align:' + parameters.align"
                v-model= "textAreaValue"
                class="textArea"
                type="text">
            </textarea>
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
            textAreaValue:"",
            isInputOkValue: false,
        }
    },
    methods:{
        setDefaultValue(){
            if(this.elementIdToSearch && this.data != undefined){
                this.textAreaValue = (this.data.data.find(item => item.elementId === this.elementId).data.text)
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
                    text : this.textAreaValue
                }
            }
            this.$emit('update', payload);
        },
        //checks if the parameters.required are true and if so, makes the frame of the inputfield red
        //sending with an event to the parent componenet if the field  is filled or not
        isInputOk(){
            //if the input value is empty and the input is required
            if(this.textAreaValue === "" && this.parameters.required){
                //then add the selectError class on the input
                this.$refs.textArea.classList.add("textAreaError");
                 //and sets the isUnputOkValue flase
                this.isInputOkValue = false
            //else delete the class from the input and set the isInputOkValue true
            }else{
                this.isInputOkValue = true
                this.$refs.textArea.classList.remove("textAreaError");
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
        this.setEditable();
        this.setDefaultValue();
    },
    mounted() {
        this.isInputOk();
    },
    computed:{
        ...mapGetters({
            permissionIds: 'authentication/getPermissionIds'
        })
    },
     watch: {
        textAreaValue:{
            handler(){
                this.isInputOk();
                this.sendEvent();
            }
        }
    } 
}
</script>
<style scoped>
.textAreaMain{
    margin-bottom: 10px;
    position: relative;
}
.inputDiv{
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.inputDiv:has(.textArea:disabled){
    border-color:gray;
}
.textAreaError{
    background-color: #282828;
    border-style: solid;
    border-color:rgb(153, 0, 0);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.textArea:focus-visible{
    outline: none;
}
.textArea{
    min-height: 100px;
    padding: 3px 5px 0 5px;
    width: 100%;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.textArea:disabled{
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