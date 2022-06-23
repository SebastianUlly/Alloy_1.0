<template>
  <div class="centeredDiv">
    <div class="popup">Kopiert!</div>
    <inputField
      :label="label"
      :elementId="elementId"
      :required="parameters.required"
      :dataOriginal="findData"
      :parameters="parameters"
    />
    
    <button title="Click here to copy to the clipboard!" @click="copy()" class="copy">
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
.popup{
  width: 60px;
  height: 30px;
  position:absolute;
  right: 3%;
  top:-25%;
  transform: translateY(-50%);
  font-size:small;
  background-color: #5BC356;
  text-align: center;
  border-radius: 6px;
  padding-top:5px;
  z-index: 1;
  border: 1px solid white;
  -webkit-animation: fadeinout 4s linear forwards;
  animation: fadeinout 4s linear forwards;
}

@-webkit-keyframes fadeinout {
  0%,100% { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes fadeinout {
  0%,100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>
