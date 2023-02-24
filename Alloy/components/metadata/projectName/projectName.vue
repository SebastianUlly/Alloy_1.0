<template>
  <div>
    <div v-for="item of childrenWithData" :key="item.elementId">
      <component
        :is="item.componentId"
        :label="item.label"
        :data-original="item.textOriginal"
        :parameters="item.parameters"
        @update="enterText($event, item)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GetElementData } from "~/assets/classes/alloyClasses";
import { deepCopy } from "~/assets/classes/objectClasses";
import inputField from '~/components/elements/lib/inputField'
export default {
  components:{
    inputField
  },
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
    return { childrenWithData: null };
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" }),
  },
  watch: {
    fileData: {
      deep: true,
      handler() {
        this.startFunction();
      },
    },
  },
  mounted() {
    this.startFunction();
  },
  methods: {
    startFunction() {
      this.findData();
      for (const item of this.children) {
        const payload = {
          elementId: item.elementId,
          hasChanged: false,
        };
        this.$store.commit("infoBox/addToHasChangedArray", payload);
      }
    },
    enterText(event, item) {
      item.textToEdit = event;
      const payload = {
        elementId: item.elementId,
        data: { text: event },
      };
      this.$store.commit("file/setEnteredData", payload);
      if (item.textToEdit === item.textOriginal) {
        const payload = {
          elementId: item.elementId,
          hasChanged: false,
        };
        // commiting the payload to the store
        this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
      } else {
        const payload = {
          elementId: item.elementId,
          hasChanged: true,
        };
        // commiting the payload to the store
        this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
      }
    },
    findData() {
      this.childrenWithData = deepCopy(this.children);
      for (const item of this.childrenWithData) {
        const data = new GetElementData(this.fileData, item.elementId);
        if (data.dataFromDatabase) {
          item.textOriginal = data.dataFromDatabase.text;
          item.textToEdit = data.dataFromDatabase.text;
        } else {
          item.textOriginal = "";
          item.textToEdit = "";
        }
      }
    },
  },
};
</script>

<style scoped></style>