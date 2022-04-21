<template>
	<div class="input">
		<input
			type="text"
			class="input__field"
			v-model="dataInComponent"
			:style="checkIfInputIsEmail"
		>
		<has-changed-indicator
			:old-data="dataFromDataBase"
			:new-data="dataInComponent"
		/>
	</div>
</template>

<script>
export default {
	data () {
		return {
			dataInComponent: '',
			dataFromDataBase: ''
		}
	},

	computed: {
		checkIfInputIsEmail () {
			if (this.dataInComponent) {
				if (String(this.dataInComponent)
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[ 0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					)) {
					return 'border: 2px solid green'
				} else {
					return 'border: 2px solid red'
				}
			}
			return ''
		}
	}
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/componets/inputField.scss';
</style>
