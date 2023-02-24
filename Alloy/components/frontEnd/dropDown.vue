<template>
    <div class="selectFiled">
        <select class="select" name="" id="">
            <option class="options" value="">
                David
            </option>
            <option class="options" value="">
                Andere David
            </option>
        </select>
    </div>
</template>

<style scoped>
.selectFiled{
    width: 350px;
    height: 50px;
    background-color: #1E1E1E;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    position:relative;
}
.select{
    width: 96%;
    border-radius: 2px;
    border: solid 1px white;
    height: 70%;
    color: white;
    padding-left: 10px;
    padding-right: 10%;
}
.options{
    color: white;
    background-color:#282828;
}

</style>