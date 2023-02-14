<template>
  <div class="labeldiv">
    <div v-for="item of children" :key="item.elementId">
      <component
        :is="item.componentId"
        :elementId="elementId"
        :options="files"
        :selectLimit="parameters.selectLimit"
        @myevent="callback"
        :label="label"
        :labelColor="labelColor"
        :originalValue="originalSelectedPharmacy"
      />
    </div>
    <!-- if the input changed gives the value back to parent -->
    <!--    <vue-json-pretty :data="selectedPharmacy" />
    <vue-json-pretty :data="originalSelectedPharmacy" /> -->
  </div>
</template>
<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
import customSelect from "../lib/customSelect.vue";
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    children: {
      type: Array,
      required: true
    },
    elementId: {
      type: String,
      required: true
    },
    parameters: {
      type: Object,
      required: false,
      default: null
    }
  },
  components: {
    customSelect
  },
  data() {
    return {
      files: [],
      selectedPharmacy: ["", "", "", "", "", "", ""],
      originalSelectedPharmacy: ["", "", "", "", "", "", ""],
      labelColor: "white"
    };
  },
  methods: {
    getfile() {
      this.$apollo
        .query({
          variables: {
            schemaId: this.parameters.selectableSchema[0]
          },
          query: gql`
            query($schemaId: String) {
              fileBySchemaId(schemaId: $schemaId) {
                id
                label
              }
            }
          `
        })
        .then(data => {
          this.files = data.data.fileBySchemaId;
          /* console.log(data); */
        })
        .catch(error => {
          console.log({ error });
        });
    },
    callback(data) {
      this.selectedPharmacy = data;
      let payload;
      if (
        JSON.stringify(this.selectedPharmacy) !==
        JSON.stringify(this.originalSelectedPharmacy)
      ) {
        this.labelColor = "red";
        payload = {
          elementId: this.elementId,
          hasChanged: true
        };
      } else {
        this.labelColor = "white";
        payload = {
          elementId: this.elementId,
          hasChanged: false
        };
      }
      this.sendData();
      this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
    },
    sendData() {
      const valuesToSend = JSON.parse(JSON.stringify(this.selectedPharmacy));
      const payload = {
        elementId: this.elementId,
        data: {
          values: valuesToSend
        }
      };
      this.$store.commit("file/setEnteredData", payload);
    },
    findData() {
      if (this.fileData) {
        for (let item of this.fileData) {
          if (this.elementId === item.elementId && item.data !== null) {
            if (item.data) {
              const valuesFromDatabase = JSON.parse(
                JSON.stringify(item.data.values)
              );
              this.originalSelectedPharmacy = valuesFromDatabase;
              this.selectedPharmacy = valuesFromDatabase;
            } else {
              this.originalSelectedPharmacy = [];
              this.selectedPharmacy = [];
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getfile();
    const payload = {
      elementId: this.elementId,
      hasChanged: false
    };
    this.findData();
    this.$store.commit("infoBox/addToHasChangedArray", payload);
  },
  computed: {
    ...mapGetters({ fileData: "file/getFileData" })
  },
  watch: {
    fileData: {
      deep: true,
      handler() {
        this.findData();
      }
    }
  }
};
</script>
<style scoped>
@import url("~/assets/scss/componets/inputForPharmacy.css");
</style>
