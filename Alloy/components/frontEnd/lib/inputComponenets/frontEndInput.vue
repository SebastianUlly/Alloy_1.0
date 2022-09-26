<template>
    <div class="body">
        <div class="label">
           {{label}}
        </div>
        <div 
            class="inputDiv"
            ref="inputX">
            <input
                :placeholder="elementId"
                v-model= "inputValue"
                class="myInput"
                type="text">
        </div>
    </div>
</template>
<script>
export default{
    props: {
        elementId: {
            type: String
        },
        label: {
            type: String
        },
        required:{
            type: Boolean
        }
    },
    data(){
        return{
            inputValue:"",
            isInputOkValue: false
        }
    },
    methods:{
        sendEvent(){
            this.$emit('inputOk', this.isInputOkValue);
        },
        isInputOk(){
            if(this.inputValue === "" && this.required){
                this.$refs.inputX.classList.add("myInputError");
                this.isInputOkValue = false
            }else{
                this.isInputOkValue = true
                this.$refs.inputX.classList.remove("myInputError");
            }
        }
    },
     watch: {
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
    width: 100%;
    padding-left: 10px;
    padding-top: 4px;
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