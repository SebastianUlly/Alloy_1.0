<template>
  <div>
      <span>
          {{label}}
      </span>
    <input type="text" v-model="ProjectNumber" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fileListVue from "../../elements/lib/fileList.vue";
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
  data() {
    return { ProjectNumber: "", OldProjectNumber: "" };
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" }),
  },
  watch: {
    ProjectNumber() {
      this.EnteredText();
    },
  },
  mounted() {
    this.findData();
  },

  methods: {
    EnteredText() {
      const payload = {
        elementId: this.elementId,
        data: { text: this.ProjectNumber },
      };
      this.$store.commit("file/setEnteredData", payload);
      if (this.ProjectNumber === this.OldProjectNumber) {
        const payload = {
          elementId: this.elementId,

          hasChanged: false,
        };

        // commiting the payload to the store

        this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
      } else {
        const payload = {
          elementId: this.elementId,

          hasChanged: true,
        };

        // commiting the payload to the store

        this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
      }
    },
    findData() {
      const data = this.fileData.find(
        (item) => item.elementId === this.elementId
      );
      this.ProjectNumber = data.data.text;
      this.OldProjectNumber = data.data.text;
    },
  },
};
</script>

<style scoped>
input {
  border: solid white 2px;
  border-radius: 4px;
  margin: 0 auto;
  width: 100%;
}
div{
    margin: auto;
    width: 100%;
    padding: 0 15px;
}
label{
    
}
</style>
