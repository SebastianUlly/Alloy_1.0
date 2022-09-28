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
            isInputOkValue: false
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
                this.inputValue = new Date().getFullYear();
            }else if(this.parameters.default === "consecutiveNumber" &&  this.directory[0]?.hierarchy){
                let currentFolder = "";
                for(let item of this.directory[0]?.hierarchy){
                     if(item.name == new Date().getFullYear()){
                        currentFolder = item.id;
                    }
                }
                this.inputValue = ++this.directory[0].hierarchy.filter(item => item.parentId == currentFolder).map(item => parseInt(item.name)).sort((a,b) => b - a)[0];
            }
        },
        //send the 
        sendEvent(){
            this.$emit('inputOk', this.inputValue);
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
        this.setDefaultValue()
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
                this.isInputOk()
            }
        }
    } 
}

</script>
<style scoped>
.body{
    margin-bottom: 10px;
    position: relative;
    /* margin: 25px 0; */
    width:100%;
    /* height: 45px; */
}
.inputDiv{
   /*  margin-top: 14px; */
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.myInputError{
   /*  margin-top: 14px; */
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
.label{
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
</style>