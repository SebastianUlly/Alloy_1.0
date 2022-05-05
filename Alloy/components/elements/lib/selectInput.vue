<template>
  <div>
    <span :style="'color:' + labelColor"> {{ label }}</span>
    <span class="required" v-if="required">required</span>
    <select v-model="selectedValue" name="" id="selector" @change="onChange()">
      <option value="">Bitte wahlen Sie</option>
      <option :key="index" v-for="(item, index) of options" :value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    elementId: {
      type: String,
      requred: true,
    },
    options: {
      type: Array,
      required: false,
      default: null,
    },
    required: {
      type: Boolean,
    },
  },
  data() {
    return { selectedValue: "", originalValue: "", labelColor: "white" };
  },
  methods: {
    onChange() {
      console.table(this.fileData);
      if (this.selectedValue !== this.originalValue) {
        this.labelColor = "yellow";
      } else {
        this.labelColor = "white";
      }
    },
    // sendData(){
    //   const payload = {
    //   elementId: this.elementId,
    //  data: this.selectedValue,
    //   }
    //  }
  },
  computed: {
    ...mapGetters({fileData: "file/getFileData" })
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
.required {
  color: red;
}
</style>
