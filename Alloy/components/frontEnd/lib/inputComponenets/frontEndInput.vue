<template>
    <div class="body">
        <div class="label">
            Label
        </div>
        <div class="inputDiv">
            <input 
                class="myInput"
                type="text">
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
    border-color:white;
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