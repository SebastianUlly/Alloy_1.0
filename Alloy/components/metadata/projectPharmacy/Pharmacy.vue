<template>
  <div>
    <span> {{ label }}</span>
    <select v-model="selectedPharmacy" name="" id="selector">
      <option value="" disabled selected>Bitte wählen sie im Menü</option>
      <option value="Apo1">Apo1</option>
      <option value="Apo2">Apo2</option>
      <option value="Apo3">Apo3</option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    elementId: {
      type: String,
      requred: true,
    },
  },
  data() {
    return { selectedPharmacy: "" };
  },
  watch: {
    selectedPharmacy(value) {
      this.sendSelectedPharmacy();
    },
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" }),
  },
  methods: {
    sendSelectedPharmacy() {
      const payload = {
        data: {
          text: this.selectedPharmacy,
        },
        elementId: this.elementId,
      };
      this.$store.commit("file/setEnteredData", payload);
    },
    findData() {
      const data = this.fileData.find(
        (item) => item.elementId === this.elementId
      );
      if (data) {
        this.selectedPharmacy = data.data.text;
      }
    },
  },
  mounted() {
    this.findData();
  },
};
</script>

<style scoped>
select {
  border: solid white 2px;
  border-radius: 4px;
  margin: 0 auto;
  width: 100%;
  color: white;
}
div {
  margin: auto;
  width: 100%;
  padding: 0 15px;
}
</style>
