<template>
  <div>
    <span>{{ label }}</span>
    <input id="zipcode" type="text" />
  </div>
</template>

<script>
export default {
  props: {
    elementId: {
      type: Number,
      required: true,
    },
    children: {
      type: Array,
      required: true,
    },
    label: {
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
    return { zipcode: "" };
  },
  watch: {
      zipcode:{
          handler(){
            
          }
      }
  },
};
</script>
