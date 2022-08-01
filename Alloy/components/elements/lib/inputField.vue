[# name: Single Line Input # author: Sebastian ULLY # type: general input
component # version: 1.0 # date: 01.02.2022 # external dependents: / # internal
dependents: Has Changed Indicator

<template>
  <!-- container to hold all thats neccessary for the input-element -->
  <div class="input">
    <!-- input-field -->
    <input
      @click="inputClicked()"
      v-model="dataToEdit"
      :title="dataToEdit"
      type="text"
      :id="'inputId-' + elementId"
      :placeholder="placeholder"
      autocomplete="off"
      :class="
        parameters.editable === false ? 'input__field-disabled' : 'input__field'
      "
      :disabled="parameters.editable === false ? true : false"
      ref="input"
      v-on:keydown.down="optionStepper(1)"
      v-on:keydown.up="optionStepper(-1)"
      v-on:keydown.enter="optionClicked(result[optionStepperCounter])"
    />
    <!-- label to the input-field -->
    <span class="input__label">
      {{ label }}
    </span>
    <!-- error-message to the input -->
    <span v-if="parameters.required && !dataToEdit" class="input__error">
      required
    </span>
    <div class="input__error">
      <has-changed-indicator :old-data="dataOriginal" :new-data="dataToEdit" />
    </div>
    <div ref="results" class="results" v-if="result.length">
      <div
        @click="optionClicked(item)"
        class="options"
        v-for="(item, index) of result"
        :id="'active-option-' + elementId + '-' + index"
      >
        {{ item.value_2 }},
        {{ item.value_1 }}
      </div>
    </div>
    <!--  <vue-json-pretty :data="parameters.elementToWatch" /> -->
    <!--  <vue-json-pretty :data="result" /> -->
  </div>
</template>

<script>
import { getConsecutiveNumber } from "~/assets/functions/consecutiveNumber";
import { mapGetters } from "vuex";
import gql from "graphql-tag";

export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true
    },
    dataOriginal: {
      required: false,
      default: ""
    },
    parameters: {
      type: Object,
      required: false,
      default: null
    },
    elementId: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      dataToEdit: "",
      placeholder: "...",
      dataToWatch: "",
      result: [],
      optionStepperCounter: -1,
      optionsActive: false,
      numberOfResults: 7,
      tableToSearch:""
    };
  },

  computed: {
    ...mapGetters({
      directory: "directory/getDirectory",
      clickedEntityId: "directory/getClickedEntityId",
      fileData: "file/getDataToSave"
    })
  },

  watch: {
    dataOriginal(value) {
      this.dataToEdit = value;
      this.defaultValue();
    },
    // watcher to watch the entered data
    dataToEdit(value) {
      this.$emit("update", value);
      this.$apollo
        .query({
          variables: {
            tableToSearch: this.parameters.materializedViewToSearch,
            dataToSearch: this.dataToEdit
          },
          query: gql`
            query(
              $tableToSearch: String
              $dataToSearch: String
              ) {
              materializedViewSearch(
                materializedViewToSearch: $tableToSearch
                searchValue: $dataToSearch
                ) {
                value_1
                value_2
                weight
              }
            }
          `
        })
        //the watcher watch if the dataToEdit value changes and saves the data from the gql in results array
        .then(data => {
          this.result = [];
          if (this.parameters.elementToWatch && this.dataToEdit) {
            for (let i = 0; i < this.numberOfResults; i++) {
              this.result.push(data.data.materializedViewSearch[i]);
            }
          }
        })
        .catch(error => {
          console.log({ error });
        });
    }
  },

  mounted() {
    this.dataToEdit = this.dataOriginal;
    this.defaultValue();
    
  },
  //listens to the event that called as the watched inputfield and fills the correct data in dataToEdit
  created() {
    this.tableToSearch = this.parameters.materializedViewToSearch;
    this.$nuxt.$on(this.elementId, item => {
      if (this.parameters.searchValue === "value_1") {
        this.dataToEdit = item.value_1;
      } else if (this.parameters.searchValue === "value_2") {
        this.dataToEdit = item.value_2;
      }
    });
  },
  methods: {
    // called when the up or down arrow keypressed and sets the value of optionStepperCounter
    optionStepper(value) {
      let nextStep = this.optionStepperCounter + value;
      this.optionStepperCounter = Math.min(
        this.result.length - 1,
        Math.max(0, nextStep)
      );
       
      // changing the color of the selected option.
      document.getElementsByClassName("options").forEach(element => {
        if (element.id === 'active-option-' + this.elementId + '-' + this.optionStepperCounter) {
          document.getElementById(
           'active-option-' + this.elementId + '-' + this.optionStepperCounter
          ).style.color = "#6bbcff";
          document.getElementById(
            'active-option-' + this.elementId + '-' + this.optionStepperCounter
          ).style.backgroundColor = "#1c3349";
        } else {
          element.style.color = "white";
          element.style.backgroundColor = "#1b1b1b";
        }
      });
    },
    // method that is called when the input is clicked. It checks if the parameters.elementToWatch exists
    // and if the dataToEdit is not empty, if both are true it replaces the class
    // resultsDisplayNone with results
    inputClicked() {
      if (this.parameters.elementToWatch && this.dataToEdit !== "") {
        this.$refs.results.classList.replace("resultsDisplayNone", "results");
      }
    },
    // when the user clicks on an option in the dropdown it checks if the
    // parameters.searchValue is plz or ort and sets the dataToEdit to the plz or ort of the clicked item
    // also replaces the class results with resultsDisplayNone and calls the method startEvent with the
    // clicked item
    // the startEvent sends the item to the component with elementToWatch
    optionClicked(item) {
      if (item) {
        if (this.parameters.searchValue === "value_2") {
          this.dataToEdit = item.value_2;
          this.$refs.results.classList.replace("results", "resultsDisplayNone");
          this.startEvent(item);
        } else if (this.parameters.searchValue === "value_1") {
          this.dataToEdit = item.value_1;
          this.$refs.results.classList.replace("results", "resultsDisplayNone");
          this.startEvent(item);
        }
      }
    },
    defaultValue() {
      if (
        this.parameters.default === "function_consecutiveNumber" &&
        !this.dataOriginal
      ) {
        this.dataToEdit = getConsecutiveNumber(
          this.directory,
          this.clickedEntityId
        )?.toString();
        if (this.dataToEdit?.length === 1) {
          this.dataToEdit = "00" + this.dataToEdit;
        } else if (this.dataToEdit?.length === 2) {
          this.dataToEdit = "0" + this.dataToEdit;
        }
      } else if (
        this.parameters.default === "variable_currentYear" &&
        !this.dataOriginal
      ) {
        this.dataToEdit = new Date().getFullYear();
      }
    },
    // it becomes the data and sends to elementToWatch component
    startEvent(item) {
      if (this.parameters.elementToWatch && this.dataToEdit !== "") {
        this.$nuxt.$emit(this.parameters.elementToWatch, item);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/scss/componets/inputField.scss";

.results {
  position: absolute;
  display: flex;
  display: none;
  max-width: 100%;
  width: 95%;
  max-height: 250px;
  background-color: #1b1b1b;
  z-index: 2;
  border: 1px solid white;
  border-radius: 4px;
  overflow: scroll;
  overflow-x: hidden;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.452);
}
.resultsDisplayNone {
  display: none;
}
.options {
  padding: 4px 0;
  padding-left: 15px;
  z-index: 2;
}
.input:hover .results:hover,
.input input:focus ~ .results {
  display: block;
}
.options:hover{
  background-color: #1c3349 !important;
  color: #6bbcff !important;
}
::-webkit-scrollbar {
  width: 10px;
  display: none;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(83, 83, 83);
  display: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(155, 155, 155);
  border-radius: 4px;
  display: none;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(141, 141, 141);
  display: none;
}
::-webkit-resizer {
  display: none;
}
::-webkit-scrollbar-corner {
  display: none;
}
</style>
]