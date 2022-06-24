<template>
	<div class="centeredDiv">
		<inputField
			:label="label"
			:elementId="elementId"
			:required="parameters.required"
			:dataOriginal="findData"
			:parameters="parameters"
		/>

		<button
			v-if="dataToCopy"
			:disabled="disableCopyButton"
			title="In die Zwischenablage kopieren!"
			@click="copy()"
			ref="copyButton"
			class="copy"
		>
			<v-icon
				:style="disableCopyButton ? 'filter: invert(50%)' : ''"
			>
				mdi-content-copy
			</v-icon>
		</button>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { hasAnythingChanged } from "~/assets/functions/hasChanged";

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
	data() {
		return {
			dataToCopy: "",
			timeout: null,
		};
	},
	methods: {
		//sends the dataToCopy to clipboard
		copy() {
			clearTimeout(this.timeout);
			this.$refs.copyButton.classList.remove("animated");
			this.$refs.copyButton.classList.add("animated");
			this.timeout = setTimeout(() => {
				this.$refs.copyButton.classList.remove("animated");
			}, 500);
			navigator.clipboard.writeText(this.dataToCopy);
		},
	},
	computed: {
		...mapGetters({
			fileData: "file/getFileData",
			fileValues: "file/getFileValues",
			directory: "directory/getDirectory",
			hasChangedArray: "infoBox/getHasChangedArray"
		}),

		// function to find the data creating the full project-designation
		findData() {
			// defining data as an empty string
			let data = "";
			// checking if the fileData and fileValues are not undefined
			if (this.fileData && this.fileValues) {
				for (let i = 0; i < this.parameters.previewList.length; i++) {
					if (i === 1 && this.fileValues.label) {
						data += this.fileValues.label;
						data += "-";
					}
					let fieldData = this.fileData.find(
						(item) => item.elementId == this.parameters.previewList[i]
					);
					data += fieldData?.data?.text ?? fieldData?.data?.values ?? "";
					if (
						(i < this.parameters.previewList.length - 1 &&
						fieldData?.data?.text) ||
						fieldData?.data?.values
					) {
						data += "-";
					}
				}
				this.dataToCopy = data;
			} else {
				data = "";
			}
			return data;
		},

		// computed property to determine if the copy button has to be disabled
		disableCopyButton() {
			// returning the result of the function that checks the hasChangedArray for any changes
			return hasAnythingChanged(this.hasChangedArray);
		},
	},
};
</script>
<style>
.centeredDiv {
  	position: relative;
}

.copy {
	position: absolute;
	right: 5%;
	top: 50%;
	transform: translateY(-50%);
	color: white;
}
.copy.animated i {
  	animation: fadeOut 0.5s;
}
@keyframes fadeOut {
	0% {
		color: #5bc356;
	}
	100% {
		color: white;
	}
}
</style>
