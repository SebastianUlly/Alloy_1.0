<template>
  <div>
    <!-- <div :key="index" v-for="index of parameters.selectLimit">
      <select class="select" name="" v-model="selectedPharmacy[index-1]">
        <option id="option" :value="items.label" v-for="items of files" :key="items.id">
          
          {{ items.label }}
        </option>
      </select>
    </div> -->
    <inputForPharmacy
      :elementId="elementId"
      :options="files"
      :selectLimit="parameters.selectLimit"
    />
      <vue-json-pretty :data="selectedPharmacy" />
  </div>
</template>
<script>
import gql from "graphql-tag";

export default {
  mounted() {
    this.getfile();
  },
  methods: {
    getfile() {
      this.$apollo
        .query({
          variables: {
            schemaId: "961fe75d-2d0e-4ccb-8afd-cde072b37380",
          },
          query: gql`
            query ($schemaId: String) {
              fileBySchemaId(schemaId: $schemaId) {
                id
                label
              }
            }
          `,
        })
        .then((data) => {
          this.files = data.data.fileBySchemaId;
          /* console.log(data); */
        })
        .catch((error) => {
          console.log({ error });
        });
    },
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    elementId: {
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
    return { files: [], selectedPharmacy:["","","","","","",""]};
  },
  watch: {
    asd: {

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
