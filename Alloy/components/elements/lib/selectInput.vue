<template>
  <div>
    <span :style="'color:' + labelColor"> {{ label }}</span> <!-- writes out the lebel name of the input element and gives sytle to it -->
    <span class="required" v-if="required">required</span>   <!-- checks if "reguired" porp is true or false and write it out -->
    <select v-model="selectedValue" name="" id="selector" @change="onChange()"> <!--triggers the onChange function -->
      <option value="">Bitte wahlen Sie</option>
      <option :key="index" v-for="(item, index) of options" :value="item">  <!-- option with for cycle that lists the options-->
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";    //importing mapgetters for using the store

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
    return { selectedValue: "", originalValue: "", labelColor: "white" }; //the data function defines the variables 
  },
  methods: {
    onChange() {                                                          // if the selected value is not the original value then add the yellow property to label
      if (this.selectedValue !== this.originalValue) {
        this.labelColor = "yellow";
        const payload = {
          elementId: this.elementId,
          hasChanged: true,
        };
        this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);  //sends the value (elementId and has changed true or false) of payload to setHasChangedPropertyOfElement function
      } else {
        this.labelColor = "white";
        const payload = {
          elementId: this.elementId,
          hasChanged: false,
        };
        this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);  //makes the same just with the case "false"
      }
      this.sendData();                                                          //at the end calls the sendData function that sends the data to the store 
    },
    findData() {                                                                // if the data in database exist then sets the original value and the selected value to the data.text
      if (this.fileData) {
        for (let item of this.fileData) {
          if (this.elementId === item.elementId && item.data != null) {
            this.originalValue = item.data.text;
            this.selectedValue = item.data.text;
          }
        }
      }
    },
    sendData() {                                                                // create the payload that contains the elementId and the text of data
      const payload = {
        elementId: this.elementId,
        data: {
          text: this.selectedValue,
        },
      };
      this.$store.commit("file/setEnteredData", payload);                       //sends the payload to the setEnteredData function
    },
  },
  mounted() {
    const payload = {
      elementId: this.elementId,
      hasChanged: false,
    };
    this.findData();
    this.$store.commit("infoBox/addToHasChangedArray", payload);
  },
  computed: {                                                                    
    ...mapGetters({ fileData: "file/getFileData" }),
  },
  watch: {                                                                      //checks the changes of fileData if it changed calls the finddata and onChange function
    fileData: {
      deep: true,
      handler() {
        this.findData();
        this.onChange();
      },
    },
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
