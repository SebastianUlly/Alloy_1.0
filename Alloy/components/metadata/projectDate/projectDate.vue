<template>
<div>
  <div class="div">
    <span>{{label}}</span>
     <br>
    <input class="inputForDatum" type="text">
  </div>
   

</div>
</template>

<script>
export default {
  props: {
    elementId: {
      type: String,
      required: false,
    },
    children: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    }
  },
  daata(){
    return{
        Year: null,
        Month: null, 
    }
  }
};

</script>

<style>
.div{
  width: 93%;
  margin:auto;
  padding-top:10px;
 
}
.inputForDatum{
 border: solid white 2px;
  border-radius: 4px;
  width:100%;
  height: 45px;
  color:white;
  font-size:larger
}

</style>
