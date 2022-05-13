<template>
  <div>
    <div  class="divclass" :key="index" v-for="index of selectLimit">
      <select
        class="select"
        @change="onChange()"
        name=""
        v-model="selectedPharmacy[index - 1]"
        :style="'color:' + labelColor"
      >
        <option :value="item.label" v-for="item of options" :key="item.id">
          {{ item.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    elementId: {
      type: String,
      required: true,
    },
    selectLimit: {
      type: Number,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    labelColor:{
      type: String,
      required: true,
    }
  },

  data() {
    return {
      originalValue: ["", "", "", "", "", "", ""],
      selectedPharmacy: ["", "", "", "", "", "", ""],
    };
  },
  methods: {
    onChange() {
      console.log(this.labelColor)
      this.$emit('myevent', this.selectedPharmacy)

    },
  },
  computed: {
    
  },
};
</script>

<style scoped>
.required {
  color: red;
}
option{
  color:aliceblue;
  width: 100%;
  margin:0 auto;
}
.select{
  border: solid white 2px;
  border-radius: 4px;
  margin: 0 auto;
  width: 80%;
  color: white;
}


</style>