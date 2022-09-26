<template>
    <div class="body">
        <div class="label">
            {{label}}
        </div>
        <div class="inputDiv">
            <select class="myInput" type="text">
                <option disabled selected value="default"> {{label}} auswählen</option>
                <option value="">asd</option>
                <option value="">asd</option>
                <option value="">asd</option>
            </select>
        </div>
        <v-icon class="mdi-chevron">mdi-chevron-down</v-icon>
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
        }
    },
    data(){
        return{

        }
    },
    methods:{
        
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
    border-color:rgb(255, 255, 255);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.myInput:focus-visible{
    outline: none;
}
.myInput{
    background-color: rgba(0, 0, 0, 0);
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
option{
    background-color:#282828;
    color: white;
}
.mdi-chevron{
    position: absolute;
    right: 10px;
    top:4px;
}
</style>