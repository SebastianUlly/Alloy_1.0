<template>
<div class="main">
    <!-- <v-btn @click="openComponent('projektListe')">Projektliste</v-btn> -->
    <v-btn @click="openComponent('zeiterfassung')">Zeiterfassung</v-btn>
</div>

</template>
<script>
export default{
    methods:{
        openComponent(component){
            this.$emit('sendComponentToFrontEnd', component)
        }
    }
}

</script>
<style>
.main{
    background-color: #272727;
    height: 50px;
    align-items: center;  
    display: flex;
    width: 50%;
    padding: 0 5px;
}

</style>

