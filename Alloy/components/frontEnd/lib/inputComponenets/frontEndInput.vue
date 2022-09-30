<template>
    <div class="body">
        <div class="label">
           {{label}}
        </div>
        <div
            class="inputDiv"
            ref="inputX">
            <input
                :disabled="!parameters.editable"
                :style="'text-align:' + parameters.align"
                v-model= "inputValue"
                class="myInput"
                type="text">
        </div>
    </div>
</template>
<script>
import gql from "graphql-tag";
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
        }
    },
    data(){
        return{
            inputValue:"",
            isInputOkValue: false,
            tempValue: ""
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
        //checking the database default value
        setDefaultValue(){
           
            if(this.parameters.default === "currentYear"){    
                this.inputValue = new Date().getFullYear().toString();
            }else if(this.parameters.default === "consecutiveNumber" &&  this.directory[0]?.hierarchy){
                
                let currentFolderId = "";
                for(let item of this.directory[0]?.hierarchy){
                     if(item.name == new Date().getFullYear()){
                        currentFolderId = item.id;
                        this.$emit('getCurrentFolderId', item.id)
                    }
                }
                //filtering the array where the parentId == currentFolderId
                this.tempValue = (++this.directory[0].hierarchy.filter(
                //converting the elements to int 
                item => item.parentId == currentFolderId).map(
                // converting the array of objects to an array of numbers, sorting it and
                // returning the first element, converting back to string
                item => parseInt(item.name)).sort((a,b) => b - a)[0]).toString();
                //converting to the correct form
                if(this.tempValue.length == 2){
                    this.inputValue = "0" + this.tempValue;
                }else if(this.tempValue.length == 1){
                    this.inputValue = "00" + this.tempValue;
                } else{
                    inputValue = this.tempValue;
                } 
            }   
        },
        //send the 
        sendEvent(){
            const payload = {
                elementId: this.elementId,
                data:{
                    text : this.inputValue
                }
            }
            this.$emit('update', payload);
        },
        //checks if the parameters.required are true and if so, makes the frame of the inputfield red
        //sending with an event to the parent componenet if the field  is filled or not
        isInputOk(){
            if(this.inputValue === "" && this.parameters.required){
                this.$refs.inputX.classList.add("myInputError");
                this.isInputOkValue = false
            }else{
                this.isInputOkValue = true
                this.$refs.inputX.classList.remove("myInputError");
            }
        }
    },
    mounted(){
        this.setDefaultValue();
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
    width:100%;
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