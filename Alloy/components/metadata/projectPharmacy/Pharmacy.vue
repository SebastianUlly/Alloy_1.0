<template>
  <div  :style="color" class="div">
    <span> {{ label }}</span>
    <select
      
      @change="setColor()"
      v-model="selectedPharmacy"
      name=""
      id="selector"
    >
      <option value="" disabled selected>Bitte wählen sie im Menü</option>

      <option
        :key="index"
        v-for="(item, index) of parameters.pharmacies"
        :value="item"
      >
        {{ item }}
      </option>
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
    parameters: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return { selectedPharmacy: "", spanColor:"white", originalValue:""};
  },
  watch: {
    selectedPharmacy(value) {
      this.sendSelectedPharmacy();
    },
    fileData: {
      deep: true,
      handler() {
        this.startFunction();
      },
    },
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" }),
    color() {
      return "color: " + this.spanColor
    }
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
      this.originalValue = this.selectedPharmacy;
      

    },
    startFunction() {
      this.findData();
      const payload = {
        elementId: this.elementId,
        hasChanged: false,
      };
      this.$store.commit("infoBox/addToHasChangedArray", payload);
    },
    setColor() {
      if(this.selectedPharmacy !== this.originalValue){
        this.spanColor="red";
        const hasChangedPayload = {
        elementId: this.elementId,
        hasChanged: true,
      };
      // commiting the payload to the store
      this.$store.commit("infoBox/setHasChangedPropertyOfElement", hasChangedPayload);
      }
      else
      {
        this.spanColor="white";
        const hasChangedPayload = {
        elementId: this.elementId,
        hasChanged: false,
      };
      // commiting the payload to the store
      this.$store.commit("infoBox/setHasChangedPropertyOfElement", hasChangedPayload);
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
