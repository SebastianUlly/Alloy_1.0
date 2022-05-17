<template>
  <div>
    <div class="divclass" :key="index" v-for="index of this.inputNumber">
      <select
        :class="[
          'select',
          selectedPharmacy[index - 1] === originalValue[index - 1]
            ? ''
            : 'changed',
        ]"
        @change="onChange()"
        v-model="selectedPharmacy[index - 1]"
      >
        <option default value="">Wählen Sie</option>
        <option :value="item.label" v-for="item of options" :key="item.id">
          {{ item.label }}
        </option>
      </select>
      <button class="deleteBtn">-</button>
    </div>
    <button
      :class="this.available ? '' : 'hidden'"
      @click="addPharmacy()"
      class="addPharmacy"
      :disabled="!this.available"
    >
      + Apotheke
    </button>
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
    originalValue: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selectedPharmacy: ["", "", "", "", "", "", ""],
      inputNumber: 0,
      available: true,
    };
  },
  methods: {
    addPharmacy() {
      console.log(this.originalValue.length)
      this.inputNumber = this.inputNumber + 1;
      if (
        this.inputNumber <= this.selectLimit - 1
      ) {
        this.available = true;
      } else{
        this.available = false;

      }
    },
    deletePharmacy(){

    },
    onChange() {
      
      this.$emit("myevent", this.selectedPharmacy);
    },
    // setting original value to string and then to a variable
    start() {
      this.selectedPharmacy = JSON.parse(JSON.stringify(this.originalValue));
    },
  },
  computed: {},
  mounted() {
    this.start();
    
  },
  watch: {
    originalValue: {
      deep: true,
      handler() {
        this.start();
      },
    },
  },
};
</script>

<style scoped>
@import url("~/assets/scss/componets/inputForPharmacy.css");
</style>
