<template>
  <div class="centeredDiv">
    <inputField
      :label="label"
      :elementId="elementId"
      :required="parameters.required"
      :dataOriginal="findData"
      :parameters="parameters"
    />
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
      fileValues: "file/getFileValues",
      directory: "directory/getDirectory"
    }),

    findData() {
      let data = "";
      if (this.fileData && this.fileValues) {
        for (let i = 0; i < this.parameters.previewList.length; i++) {
          if (i === 1) {
            data += this.fileValues.label
            data += "-";
          }
          let fieldData =
            this.fileData.find(
              item => item.elementId == this.parameters.previewList[i]
            )
          data +=
            fieldData?.data?.text ??
            fieldData?.data?.values
            "n/a";
          if (i < this.parameters.previewList.length - 1) {
            data += "-";
          }
        }
      }
      return data;
    }
  }
};
</script>
