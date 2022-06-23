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
  </div>
</template>
<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
export default {
	props: {
		label: {
			type: String,
			required: true,
		},
		children: {
			type: Array,
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
		return {
			files: [],
			selectedPharmacy: ["", "", "", "", "", "", ""],
			originalSelectedPharmacy: ["", "", "", "", "", "", ""],
			labelColor: "white",
		};
	},
	methods: {
		getfile() {
		this.$apollo
			.query({
			variables: {
				schemaId: this.parameters.selectableSchema[0],
			},
			query: gql`
				query ($schemaId: String) {
				fileBySchemaId(schemaId: $schemaId) {
					id
					label
					data
				}
				}
			`,
			})
			.then((data) => {
				const temp = data.data.fileBySchemaId;
				this.files = temp.map(
					function (item, index, array) {
						return item.data.find(
							(elementData) =>
								elementData.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0"
							)?.data?.text;
					}
				);
			})
			.catch((error) => {
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
					hasChanged: true,
				};
			} else {
				this.labelColor = "white";
				payload = {
					elementId: this.elementId,
					hasChanged: false,
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
					values: valuesToSend,
				},
			};
			this.$store.commit("file/setEnteredData", payload);
		},
		findData() {
			// checking if fileData is found
			if (this.fileData) {
				// getting the correct item withe the elementId
				const item = this.fileData.find(
					(item) => item.elementId === this.elementId
				);
				// checking if the item is found and has data
				if (item?.data?.text) {
					const valuesFromDatabase = JSON.parse(
						JSON.stringify(item.data.text)
					);
					this.originalSelectedPharmacy = valuesFromDatabase;
					this.selectedPharmacy = valuesFromDatabase;
				} else {
					this.originalSelectedPharmacy = [];
					this.selectedPharmacy = [];
				}
			}
		},
	},
	mounted() {
			this.getfile();
			const payload = {
				elementId: this.elementId,
				hasChanged: false,
			};
			this.findData();
			this.$store.commit("infoBox/addToHasChangedArray", payload);
	},
	computed: {
		...mapGetters({
			fileData: "file/getFileData"
		}),
	},
	watch: {
		fileData: {
			deep: true,
			handler() {
				this.findData();
			},
		},
	},
};
</script>
<style scoped>
@import url("~/assets/scss/componets/inputForPharmacy.css");
</style>
