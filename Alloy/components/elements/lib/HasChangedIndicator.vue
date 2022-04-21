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
		}
	},

	computed: {
		showHasChangedIndicator () {
			if (JSON.stringify(this.oldData) !== JSON.stringify(this.newData)) {
				return true
			}
			return false
		}
	}
}
</script>

<style scoped>
.save-alert {
	color: red;
}
</style>
