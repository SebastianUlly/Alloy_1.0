<template>
  <div>
    <div class="list">
      <div class="listedPharmaciesDiv" v-for="item of allPharmacy" :key="item">
        <div class="listedPharmacies">{{ item }}</div>
        <div class="deleteButton">
          <v-icon> mdi-delete </v-icon>
        </div>
      </div>
    </div>

    <!-- <vue-json-pretty :data="originalValue"/>
    <vue-json-pretty :data="selectedPharmacy"/> -->
    <div class="divclass">
      <select class="select" id="options">
        <option selected disabled value="">Wählen Sie die gewünschte Apotheke aus</option>
        <option :value="item.label" v-for="item of availablePharmacies" :key="item.id">
          <div>{{ item.label }}</div>
        </option>
      </select>
      <button @click="addPharmacy()" :disabled="availablePharmacies.length === 0" class="addButton">+</button>
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
    originalValue: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selectedPharmacy: [],
      inputNumber: 0,
      available: true,
      pharmacyIsActive: [],
    };
  },
  methods: {
    deletePharmacy() {},
    addPharmacy() {
      const optionValue = document.getElementById("options").value;
      this.selectedPharmacy.push(optionValue);
      this.$emit("myevent", this.allPharmacy);
      document.getElementById('options').value = "";
      this.pharmacyIsActive.push(optionValue);
    },
    start() {
      //this.selectedPharmacy = JSON.parse(JSON.stringify(this.originalValue));
    },
  },
  computed: {
    allPharmacy() {
      return [...this.originalValue, ...this.selectedPharmacy];
    },
    availablePharmacies(){
      return this.options.filter(p => !this.allPharmacy.includes(p.label));
    },
  },
  mounted() {},
  created() {},
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
