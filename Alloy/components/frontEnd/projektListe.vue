<template>
  <div>
    <vue-json-pretty v-if="querySchemaById" :data="querySchemaById" />
    <!-- <vue-json-pretty v-if="fileBySchemaId" :data="fileBySchemaId"/> -->

    <input type="text" v-model="search" />
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="20"
      :search="search"
      class="elevation-1"
    ></v-data-table>
    <button @click="dataFill()">Test Button</button>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
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
    //data with query from the projects
    fileBySchemaId: gql`
      query Files {
        fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
          label
          data
        }
      }
    `,
    //data with query from the metadata
    querySchemaById: gql`
      query PreviewList {
        querySchemaById(id: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
          label
          metadata
          elements
        }
      }
    `
  },
  methods: {
    //test button to fill the header
    dataFill() {
      for (const elementIdToFind of this.querySchemaById.metadata
        .metadata_elements[0].parameters.previewList) {
        for (const item of this.querySchemaById.elements) {
          if (item.elementId === elementIdToFind) {
            this.headers.push({
              text: item.label,
              sortable: true,
              value: "test"
            });
          } 
        }
        for (const itemInMetadata of this.querySchemaById.metadata.metadata_elements) {
              if (itemInMetadata.elementId === elementIdToFind) {
                this.headers.push({
                  text: itemInMetadata.label,
                  sortable: true,
                  value: "test"
                });
              }
            }
      }
    },
    //converts the objects to array and fills the items array
    start() {
      if (this.fileBySchemaId) {
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
    }
  },
  mounted() {
    this.start();
  },
  watch: {
    fileBySchemaId: {
      deep: true,
      handler() {
        this.start();
      }
    }
  },
  computed: {
    ...mapGetters({
      fileValues: "file/getFileValues"
    })
  }
};
</script>

<style>
.elevation-1 {
  margin-top: 100px;
  max-width: 80%;
}
</style>
