<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="20"
      class="elevation-1"
    ></v-data-table>
    <button @click="test()">Test Button</button>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  
  data() {
    return {
      headers: [],
      items: []
    };
  },
  apollo: {
    fileBySchemaId: gql`
      query Files {
        fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
          label
          data
        }
      }
    `
  },
  methods: {
    test(){
      console.log(this.fileBySchemaId, this.fileBySchemaId.length)
    }
  }
};
</script>

<style>
.elevation-1 {
  margin-top: 100px;
  max-width: 50%;
}
</style>
