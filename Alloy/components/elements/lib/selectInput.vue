<template>
  <div class="select-container">
    <!-- <v-icon class="chevron">mdi-chevron-down</v-icon> -->
    <span
		class="label"
	>
		{{ label }}
	</span>
    <span
		v-if="required"
		class="required"
	>
		required
	</span>
    <select
		v-model="selectedValue"
		id="selector"
		@change="onChange()"
	>
		<option value="">
			...
		</option>
		<option
			v-for="(item, index) of options"
			:key="index"
			:value="item"
		>
			{{ item }}
		</option>
    </select>
	<div class="has-changed">
		<has-changed-indicator
			:old-data="originalValue"
			:new-data="selectedValue"
		/>
	</div>
  </div>
</template>

<script>
//importing mapgetters for using the store
import { mapGetters } from "vuex";
import hasChangedIndicator from "~/components/elements/lib/HasChangedIndicator";
export default {
	components:{
		hasChangedIndicator
	},
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

	// the data function defines the variables
	data() {
		return {
		selectedValue: "",
		originalValue: ""
		};
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
		...mapGetters({
			fileData: "file/getFileData"
		}),
	},

	watch: {
		// checks the changes of fileData if it changed calls the finddata and onChange function
		fileData: {
			deep: true,
			handler() {
				this.findData();
				this.onChange();
			}
		}
	},

	methods: {
		// if the selected value is not the original value then add the yellow property to label
		onChange() {
			if (this.selectedValue !== this.originalValue) {
				const payload = {
					elementId: this.elementId,
					hasChanged: true,
				};
				// sends the value (elementId and has changed true or false) of payload to setHasChangedPropertyOfElement function
				this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
			} else {
				const payload = {
					elementId: this.elementId,
					hasChanged: false,
				};
				//makes the same just with the case "false"
				this.$store.commit("infoBox/setHasChangedPropertyOfElement", payload);
			}
			// at the end calls the sendData function that sends the data to the store
			this.sendData();
		},

		// if the data in database exist then sets the original value and the selected value to the data.text
		findData() {
			// checking if fileData exists
			if (this.fileData) {
				// finding the data-item in fileData
				const item = this.fileData.find(item => item.elementId === this.elementId)
				// checking if the item is found and if it contains data
				if (item?.data?.text) {
					// assigning the values
					this.originalValue = item.data.text;
					this.selectedValue = item.data.text;
				} else {
					// if nothing is found the values are empty
					this.originalValue = ''
					this.selectedValue = ''
				}
			}
		},

		// create the payload that contains the elementId and the text of data
		sendData() {
			const payload = {
				elementId: this.elementId,
				data: {
				text: this.selectedValue,
				},
			};
			//sends the payload to the setEnteredData function
			this.$store.commit("file/setEnteredData", payload);
		},

		openSelectOptions() {
			let x = document.getElementById("selector");
			x.size = x.options.length;
		},
	},
};
</script>

<style scoped>
select {
	border: solid white 2px;
	border-radius: 4px;
	padding: 10px;
	margin: 0 auto;
	width: 100%;
	color: white;
	height: 48px;
	background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>")
		no-repeat;
	background-position: calc(100% - 0.75rem) center !important;
	-moz-appearance: none !important;
	-webkit-appearance: none !important;
	appearance: none !important;
	padding-right: 2rem !important;
}

.select-container {
	margin: 15px auto;
	width: 100%;
	padding: 0 15px;
	position: relative;
	z-index: 1;
}
.required {
  	color: red;
}

option {
	color: white;
	background-color: #1e1e1e;
	padding: 10px;
	font-size:17px;
}
.label {
	color: white;
	position: absolute;
	top: -6px;
	left: 20px;
	background-color: #1e1e1e;
	font-size: 12.6px;
	padding: 0 6px;
	max-width: 76%;
}
.chevron {
	position: absolute;
	top: 50%;
	right: 5%;
	transform: translateY(-50%);
	z-index: 2;
}

.has-changed {
	position: absolute;
    right: 5px;
    bottom: -9px;
    padding: 0 11px;
    white-space: nowrap;
    transform: scale(0.8);
    transform-origin: 0 0;
    transition: transform 120ms ease-in;
    background-color: #212121;
}
</style>