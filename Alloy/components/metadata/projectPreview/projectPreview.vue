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

    // function to find the data creating the full project-designation
    findData() {
      // defining data as an empty string
      let data = "";
      // checking if the fileData and fileValues are not undefined
      if (this.fileData && this.fileValues) {
        // adding the parent-folder of the project (parentfolders of projects are the first piece of data creating the full project-designation) to the empty data-string
        data += this.directory.find(item => item.id === this.fileValues.parentIds[0])?.label
        // adding a dash between every piece of data
        data += "-";
        // adding the project-label
        data += this.fileValues.label
        // adding a dash between every piece of data
        data += "-";
        // looping through the list of elementIds in the schema defining what additional information is needed for the project-preview
        for (let i = 0; i < this.parameters.previewList.length; i++) {
          // finding the
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
