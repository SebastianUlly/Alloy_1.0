<template>
  <div>
    <span>
      {{ label }}
    </span>
    <input type="text" v-model="ProjectNumber" id="farbe" />
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import { GetElementData } from '~/assets/classes/alloyClasses';
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
    return { ProjectNumber: "" };
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" }),
    validation() {
      if (this.ProjectNumber.length >= 5) {
        return true;
      }
      return false;
    },
  },
  watch: {
    ProjectNumber(value) {
      this.EnteredText();
      const farbe2 = document.getElementById("farbe");
      if(value.length >= 5){
        farbe2.classList.add("active");
      }
      else{
        farbe2.classList.remove("active");
      }
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
    },
    findData() {
      const data = this.fileData.find(
        (item) => item.elementId === this.elementId
      );
      this.ProjectNumber = data.data.text;
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
  color: white;
}
.active{
    border: solid green 2px;
}
div {
  margin: auto;
  width: 100%;
  padding: 0 15px;
}
label {
}
input:focus {
  outline: none;
}
</style>
