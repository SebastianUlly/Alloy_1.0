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
			const payload = {
				key: 'required',
				value: this.dataToEdit
			}
			this.$emit('update', payload)
		}
	}
}
</script>