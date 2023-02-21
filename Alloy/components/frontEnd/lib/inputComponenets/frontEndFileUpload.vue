<template>
    <div class="inputMain">
        <div class="label">
            {{ label }}
        </div>
        <div class="inputDivBackground">
             <v-file-input class="fileInput"></v-file-input>
        </div>
    </div>
</template>

<script>
export default{
    props: {
        elementId:{
            type: String
        },
        label: {
            type: String
        },
        parameters: {
            type: Object
        },
        permissions: {
            type: Object
        }
    },
    data(){
        return{
            
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
    padding-left: 10px;
    padding-right: 10px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
    height: 60px;
}
.label{
    color: white;
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}

</style>