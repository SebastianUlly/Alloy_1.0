<template>
	<div>
		<input type="checkbox" v-model="dataToEdit">
		{{ dataOfProperty }}
	</div>
</template>

<script>
export default {
	props: {
		dataOfProperty: {
			required: false
		}
	},

	data () {
		return {
			dataToEdit: false
		}
	},

	watch: {
		dataOfProperty () {
			this.dataToEdit = this.dataOfProperty
		},

		dataToEdit () {
			this.$emit('update', this.dataToEdit)
		}
	}
}
</script>