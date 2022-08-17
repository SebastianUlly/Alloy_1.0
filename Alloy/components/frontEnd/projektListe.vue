<template>
  <div>
    <input type="text" v-model="search" />
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="20"
      :search="search"
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
      headers: [
        {
          text: "Projektnummer",
          align: "start",
          sortable: true,
          value: "projectnumber"
        },
        { text: "Jahr", value: "date", sortable: false },
        { text: "Projekt", value: "project", sortable: false },
        { text: "Apotheke", value: "pharmacy", sortable: false },
        { text: "Zustand", value: "status", sortable: false }
      ],
      items: [],
      search: ""
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
    start() {
      this.items = this.fileBySchemaId.map(rowItem => {
        let item = Object.values(rowItem);
        let temp = [
          item[0],
          ...Object.values(item[1]).map(element => {
            return element.data?.text;
          }),
          item[2]
        ];
        return {
          projectnumber: temp[0],
          date: temp[2],
          project: temp[1],
          pharmacy: temp[4],
          status: temp[3]
        };
      });
    }
  },
  mounted() {
    this.start();
  }
};
</script>

<style>
.elevation-1 {
  margin-top: 100px;
  max-width: 50%;
}
</style>
