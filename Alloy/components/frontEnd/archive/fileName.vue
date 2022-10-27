<template> 
    <input type="text" placeholder="fileName">
</template>
<script>
export default{
    props: {
		elementId: {
			type: String,
			required: true
		},
		children: {
			type: Array,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	}
}
</script>