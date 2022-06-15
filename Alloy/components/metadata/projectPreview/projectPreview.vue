<template>
  <div class="centeredDiv">
    <inputField
      :label="label"
      :elementId="elementId"
      :required="parameters.required"
      :dataOriginal="findData"
      :parameters="parameters"
    />
    <vue-json-pretty :data="fileData" />
    <vue-json-pretty :data="fileValues" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    elementId: {
      type: String,
      required: true
    },
    children: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    parameters: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      fileData: "file/getFileData",
      fileValues: "file/getFileValues"
    }),

    findData() {
      let data = "";
      if (this.fileData && this.fileValues) {
        for (let i = 0; i < this.parameters.previewList.length; i++) {
          let fieldData =
            this.fileData.find(
              item => item.elementId == this.parameters.previewList[i]
            ) ??
            (this.fileValues.parentIds.includes(this.parameters.previewList[i])
              ? this.fileValues
              : null);
          data +=
            fieldData?.data?.text ??
            fieldData?.data?.values ??
            fieldData?.label ??
            "n/a";
          if (i < this.parameters.previewList.length - 1) {
            data += "-";
          }
        }
      }
      return data;
    }
  },
  methods: {}
};
</script>
