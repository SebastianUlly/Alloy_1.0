<template>
    <div>
       <div :key="index" v-for="(index) of parameters.selectLimit">
           <selectInput
           :label="label"
           :elementId="elementId"
           :required="parameters.required"
           
           /> 
           </div>
    </div>

</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    elementId: {
      type: String,
      required: true,
    },
    parameters: {
      type: Object,
      required: false,
      default: null,
      
    },
    
  },
  data() {
    return {};
  },
};
</script>
