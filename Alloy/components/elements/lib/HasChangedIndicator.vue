<template>
	<div>
		<!-- has-changed-indicator icon -->
		<v-icon v-if="showHasChangedIndicator" class="save-alert">
			mdi-content-save-alert
		</v-icon>
	</div>
</template>

<script>
export default {
	props: {
		oldData: {
			required: true
		},

		newData: {
			required: true
		},

		elementId: {
			type: String,
			required: false
		}
	},

	computed: {
		showHasChangedIndicator () {
			if (JSON.stringify(this.oldData) !== JSON.stringify(this.newData)) {
				return true
			}
			return false
		}
	},

	watch: {
		newData: {
			deep: true,
			handler () {
				if (JSON.stringify(this.newData) !== JSON.stringify(this.oldData)) {
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
			}
		}
	}
}
</script>

<style scoped>
.save-alert {
	color: red;
}
</style>
