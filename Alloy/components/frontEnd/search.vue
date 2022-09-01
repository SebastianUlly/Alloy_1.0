<template>
    <div class="searchField">
        <input 
            placeholder="Suche"
            v-model="searchValue"
            class="searchInput"
            type="text">
        <v-icon medium class="searchIcon">
            mdi-magnify
        </v-icon>
    </div>
</template>

<script>
export default {
    data(){
        return{
            searchValue:""
        }
    },
    watch:{
        searchValue:{
            handler(){
                this.$emit('sendValue', this.searchValue)
            }
        }
    }
}


</script>

<style>
.searchField{
    width: 500px;
    height: 50px;
    margin-left:auto;
    background-color: #1E1E1E;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    position:relative;
}
.searchInput{
    display: block;
    border-radius: 2px;
    width: 96%;
    border: solid 1px white;
    height: 70%;
    position:absolute;
    z-index: 1;
    color: white;
    padding-left: 5px;
    padding-right: 10%;
    
}
.searchIcon{
    float: right;
    margin-left: 85%;
}

</style>