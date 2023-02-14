<template>
  <div class="padding">
    <div class="list">
      <span class="label" :style="'color:' + labelColor">{{ label }}</span>
      <!-- showing a message when the allSelectedItems array is empty -->
      <div class="text" v-if="!allSelectedItems.length" style="color: grey">
        ...
      </div>
      <!-- loop that creates a div for each item in the allSelectedItems array -->
      <div
        id="div"
        class="listedPharmaciesDiv"
        v-for="(item, index) of allSelectedItems"
        :key="item"
      >
        <div class="listedPharmacies">{{ item }}</div>

        <div class="deleteButton">
          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          <v-icon v-if="selectLimit > 1" :disabled="index === 0" @click="move(index, -1)">
            mdi-arrow-up-bold
          </v-icon>
          <v-icon
          v-if="selectLimit > 1"
            :disabled="index === allSelectedItems.length - 1"
            @click="move(index, 1)"
            >mdi-arrow-down-bold</v-icon
          >
        </div>
      </div>
    </div>
    <!--  select and add button to add the selected pharmacy to the array -->
    <div class="divclass" v-if="availableItems.length > 0 && allSelectedItems.length < selectLimit">
      <select v-model="optionValue" class="select" id="options">
        <option default disabled value=""
          >Wählen Sie die gewünschte {{this.label}} aus</option
        >
        <!-- loop for writing the options out -->
        <option
          :value="item.label"
          v-for="item of availableItems"
          :key="item.id"
        >
          <div>{{ item.label }}</div>
        </option>
      </select>
      <!-- button that calls the addItem() when clicked it is disabled if the availableItems array is empty or the optionValue is empty -->
      <button
        @click="addItem()"
        :disabled=" optionValue === ''"
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
      required: false
    }
  },

  data() {
    return {
      inputNumber: 0,
      available: true,
      itemIsActive: [],
      optionValue: "",
      allSelectedItems: []
    };
  },
  methods: {
    //called when the up or down arrow is clicked it takes the index of the item that is clicked and the direction (1 or -1) and then it moves the item in the array.
    move(index, direction) {
      this.allSelectedItems.splice( index + direction, 0, this.allSelectedItems.splice(index, 1)[0])},
    //deleting pharmacies from allSelectedItems
    deleteItem(itemForDelete) {
      for (let i = 0; i < this.allSelectedItems.length; i++) {
        if (this.allSelectedItems[i] === itemForDelete) {
          this.allSelectedItems.splice(i, 1);
        }
      }
    },

    // adding the selected pharmacy to the allSelectedItems array
    addItem() {
      this.allSelectedItems.push(this.optionValue);
      this.optionValue = "";
      this.itemIsActive.push(this.optionValue);
    },

    //called when the originalValue or the allSelectedItems is changed and converts it to an array
    start() {
      this.allSelectedItems = JSON.parse(JSON.stringify(this.originalValue));
    },
  },
  // Filtering the options array and returning the items that are not in the allSelectedItems array.
  computed: {
    availableItems() {
      return this.options.filter(p => !this.allSelectedItems.includes(p.label));
    }
  },
  // watching the allSelectedItems and if it changes it will call the start() method
  watch: {
    allSelectedItems: {
      deep: true,
      handler() {
        this.$emit("myevent", this.allSelectedItems);
      }
    },
    // watching the originalValue and if it changes it will call the start() method
    originalValue: {
      deep: true,
      handler() {
        console.log('kalsd', this.originalValue)
        this.start();
      }
    }
  }
};
</script>

<style scoped>
@import url("~/assets/scss/componets/inputForPharmacy.css");
</style>
