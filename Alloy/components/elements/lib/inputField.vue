# name: Single Line Input
# author: Sebastian ULLY
# type: general input component
# version: 1.0
# date: 01.02.2022
# external dependents: /
# internal dependents: Has Changed Indicator

<template>
	<!-- container to hold all thats neccessary for the input-element -->
	<div
		class="input"
	>
		<!-- input-field -->
		<input
			v-model="dataToEdit"
			type="text"
			placeholder="..."
			:class="parameters.editable === false ? 'input__field-disabled' : 'input__field'"
			:disabled="parameters.editable === false ? true : false"
		>
		<!-- label to the input-field -->
		 <span class="input__label">
			{{ label }}
		</span>
		<!-- error-message to the input -->
		<span
			v-if="parameters.required && !dataToEdit"
			class="input__error"
		>
			required
		</span>
		<div class="input__error">
			<has-changed-indicator
				:old-data="dataOriginal"
				:new-data="dataToEdit"
			/>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		label: {
			type: String,
			required: true
		},
		dataOriginal: {
			type: String,
			required: false,
			default: ''
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			dataToEdit: ''
		}
	},

	watch: {
		dataOriginal (value) {
			this.dataToEdit = value
		},
		// watcher to watch the entered data
		dataToEdit (value) {
			this.$emit('update', value)
		}
	},

	mounted () {
		this.dataToEdit = this.dataOriginal
	}
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/componets/inputField.scss';
</style>
