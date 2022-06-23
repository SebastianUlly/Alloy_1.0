<template>
  <div class="centeredDiv">
    <inputField
      :label="label"
      :elementId="elementId"
      :required="parameters.required"
      :dataOriginal="findData"
      :parameters="parameters"
    />
    <button v-if="dataToCopy" @click="copy()" class="copy">
      <v-icon>mdi-content-copy</v-icon>
    </button>
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
  data() {
    return {
      dataToCopy: ""
    };
  },
  methods: {
    //sends the dataToCopy to clipboard
    copy() {
      navigator.clipboard.writeText(this.dataToCopy);
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
        for (let i = 0; i < this.parameters.previewList.length; i++) {
          if (i === 1 && this.fileValues.label) {
            data += this.fileValues.label;
            data += "-";
          }
          let fieldData = this.fileData.find(
            item => item.elementId == this.parameters.previewList[i]
          );
          data += fieldData?.data?.text ?? fieldData?.data?.values ?? "";
          if (
            (i < this.parameters.previewList.length - 1 &&
              fieldData?.data?.text) ||
            fieldData?.data?.values
          ) {
            data += "-";
          }
        }
        this.dataToCopy = data;
      } else {
        data = "";
      }

      return data;
    }
  }
};
</script>
<style>
.centeredDiv {
  position: relative;
}

.copy {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
