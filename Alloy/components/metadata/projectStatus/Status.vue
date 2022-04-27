<template>
  <div>
    <span> {{ label }}</span>
    <select v-model="projectState" name="" id="selector">
      <option value="" disabled selected>
        Bitte wählen sie den Zustand aus
        
      </option>
      <option  :key="index" v-for="(item,index) of parameters.states" :value="item">
        {{item}}
      </option>
    </select>
    <!--  <vue-json-pretty :data="parameters"/> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    elementId: {
      type: String,
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
  watch: {
    projectState(value) {
      this.sendProjectState();
    },
    fileData: {
      deep:true,
      handler(){
        this.startFunction()
      }
    }
  },

  data() {
    return {
      projectState: "",
    };
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" }),
  },
  methods: {
    sendProjectState() {
      const hasChangedPayload = {
        elementId: this.elementId,
        hasChanged: true,
      };
      // commiting the payload to the store
      this.$store.commit("infoBox/setHasChangedPropertyOfElement", hasChangedPayload);
      const payload = {
        data: {
          text: this.projectState,
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
        this.projectState = data.data.text;
      }
    },
    startFunction() {
      this.findData();

      const payload = {
        elementId: this.elementId,
        hasChanged: false,
      };
      this.$store.commit("infoBox/addToHasChangedArray", payload);
    },
  },

  mounted() {
    this.startFunction();
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
