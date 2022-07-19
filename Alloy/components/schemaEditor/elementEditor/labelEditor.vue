<template>
	<div>
		<input type="text" class="input" v-model="label">
	</div>
</template>

<script>
export default {
	props: {
		element: {
			type: Object,
			required: true
		}
	},

	data () {
		return {
			label: ''
		}
	},

	watch: {
		element: {
			deep: true,
			handler () {
				this.getData()
				console.log('asdj')
			}
		},

		label () {
			this.$emit('update', this.label)
		}
	},

	methods: {
		getData () {
			this.label = this.element.label
		}
	},
}
</script>

<style lang="scss" scoped>
.input {
	border: solid 2px white;
	color: white;
}
</style>