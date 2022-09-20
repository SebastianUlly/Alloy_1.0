<template>
    <div class="body">
        <div class="label">
            Label
        </div>
        <div class="inputDiv">
            <select class="myInput" type="text">
                <option value="">MDE</option>
                <option value="">WQD</option>
                <option value="">VAD</option>
                <option value="">VAD</option>
            </select>
            <v-icon class="mdi-chevron">mdi-chevron-down</v-icon>
        </div>
    </div>
</template>

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
    z-index: 0;
}
</style>