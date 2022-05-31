<template>
  <div>
    <div class="list">
      <span class="label" :style="'color:' + labelColor">{{ label }}</span>
      <!-- showing a message when the allPharmacy array is empty -->
      <div v-if="!allPharmacy.length" style="text-align:center; color: grey">
        Noch keine Apotheke ausgewählt
      </div>
      <!-- loop that creates a div for each item in the allPharmacy array -->
      <div
        id="div"
        class="listedPharmaciesDiv"
        v-for="item of allPharmacy"
        :key="item"
      >
        <div class="listedPharmacies">{{ item }}</div>

        <div class="deleteButton">
          <v-icon @click="deletePharmacy(item)"> mdi-delete </v-icon>
          <v-icon @click="move(+1 ,item)">mdi-arrow-down-bold</v-icon>
          <v-icon @click="move(-1, item)">mdi-arrow-up-bold</v-icon>
        </div>
      </div>
    </div>
   <!--  select and add button to add the selected pharmacy to the array -->
    <div class="divclass">
      <select v-model="optionValue" class="select" id="options">
        <option selected disabled value=""
          >Wählen Sie die gewünschte Apotheke aus</option
        >
        <!-- loop for writing the options out -->
        <option
          :value="item.label"
          v-for="item of availablePharmacies"
          :key="item.id"
        >
          <div>{{ item.label }}</div>
        </option>
      </select>
      <!-- button that calls the addPharmacy() when clicked it is disabled if the availablePharmacies array is empty or the optionValue is empty -->
      <button
        @click="addPharmacy()"
        :disabled="availablePharmacies.length === 0 || optionValue === ''"
        class="addButton"
      >
        +
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    elementId: {
      type: String,
      required: true
    },
    selectLimit: {
      type: Number,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    originalValue: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    labelColor: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      inputNumber: 0,
      available: true,
      pharmacyIsActive: [],
      optionValue: "",
      allPharmacy: []
    };
  },
  methods: {
    move(direction, item){
      let temporary = this.allPharmacy;
      for(let i; i < temporary.length; i++){
        if(item === temporary[i]){
          let itemToMove = temporary[i];
          console.log(itemToMove)
        }
      }
    },
    //deleting pharmacies from allPharmacy
    deletePharmacy(itemForDelete) {
      for (let i = 0; i < this.allPharmacy.length; i++) {
        if (this.allPharmacy[i] === itemForDelete) {
          this.allPharmacy.splice(i, 1);
        }
      }
      this.$emit("myevent", this.allPharmacy);
    },

    // adding the selected pharmacy to the allPharmacy array
    addPharmacy() {
      this.allPharmacy.push(this.optionValue);
      this.$emit("myevent", this.allPharmacy);
      this.optionValue = "";
      this.pharmacyIsActive.push(this.optionValue);
    },

    //called when the originalValue is changed and converts it to an array
    start() {
      this.allPharmacy = JSON.parse(JSON.stringify(this.originalValue));
    }
  },
  // Filtering the options array and returning the items that are not in the allPharmacy array.
  computed: {
    availablePharmacies() {
      return this.options.filter(p => !this.allPharmacy.includes(p.label));
    }
  },
  mounted() {},
  created() {},
  // watching the originalValue and if it changes it will call the start() method.
  watch: {
    originalValue: {
      deep: true,
      handler() {
        this.start();
      }
    }
  }
};
</script>

<style scoped>
@import url("~/assets/scss/componets/inputForPharmacy.css");
</style>
