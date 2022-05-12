<template>
  <div>
    <div :key="index" v-for="index of selectLimit">
      <select
        class="select"
        @change="onChange()"
        onchange = "$emit('myevent')"
        name=""
        v-model="selectedPharmacy[index - 1]"
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
    value: {
      type: Array,
    },
    modelValue: {
      type: Array,
    },
  },

  data() {
    return {
      originalValue: ["", "", "", "", "", "", ""],
      selectedPharmacy: ["", "", "", "", "", "", ""],
    };
  },
  methods: {
    onChange() {
      if (
        JSON.stringify(this.selectedPharmacy) !==
        JSON.stringify(this.originalValue)
      ) {
        const payload = {};
      }
    },
  },
  computed: {
      inputVal:{
          get(){
              return this.modelValue
          },
          set(val){
            this.$emit('update:modelValue', val)
          }
      }
  },
};
</script>
