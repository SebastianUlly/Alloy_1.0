<template>
  <div>
   <selectInput
   :elementId="elementId"
   :children="children"
   :label="label"
   :options="parameters.options"
   :required="parameters.required"
   
   
   />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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

</style>
