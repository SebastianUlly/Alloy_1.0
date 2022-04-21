<template>
	<div>
		<single-line-text
			:element-id="elementId"
			:name="name"
			:label="label"
			:has-error="hasError"
		/>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		elementId: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		hasError: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style scoped>

</style>
