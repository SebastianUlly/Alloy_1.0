<template>
	<div>
		<selectInput
			:elementId="elementId"
			:children="children"
			:label="label"
			:options="parameters.options"
			:required="parameters.required"
		/>
	</div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
	props: {
		elementId: {
			type: String,
			required: true,
		},
		children: {
			type: Array,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		parameters: {
			type: Object,
			required: false,
			default: null,
		},
	},
	computed: {
		...mapGetters({ fileData: "file/getFileData" }),
	},
	watch: {
		fileData: {
			deep: true,
			handler() {
				this.startFunction();
			},
		},
	},
	mounted() {
		this.startFunction();
	},
	methods: {
		startFunction() {
			const payload = {
				elementId: this.elementId,
				hasChanged: false,
			};
			this.$store.commit("infoBox/addToHasChangedArray", payload)
		}
	},
};
</script>
