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
		<!-- <button @click="defaultValue">
			consecutive number
		</button> -->
	</div>
</template>

<script>
import { getConsecutiveNumber } from '~/assets/functions/consecutiveNumber'
import { mapGetters } from 'vuex'

export default {
	inheritAttrs: false,
	props: {
		label: {
			type: String,
			required: true
		},
		dataOriginal: {
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

	computed: {
		...mapGetters({
			directory: 'directory/getDirectory',
			clickedEntityId: 'directory/getClickedEntityId'
		})
	},

	watch: {
		dataOriginal (value) {
			this.dataToEdit = value
			this.defaultValue()
		},
		// watcher to watch the entered data
		dataToEdit (value) {
			this.$emit('update', value)
		}
	},

	mounted () {
		this.dataToEdit = this.dataOriginal
		this.defaultValue()
	},

	methods: {
		defaultValue () {
			// console.log(this.directory)
			if (this.parameters.default === 'function_consecutiveNumber' && !this.dataOriginal) {
				this.dataToEdit = getConsecutiveNumber(this.directory, this.clickedEntityId)?.toString()
				if (this.dataToEdit?.length === 1) {
					this.dataToEdit = '00' + this.dataToEdit
				} else if (this.dataToEdit?.length === 2) {
					this.dataToEdit = '0' + this.dataToEdit
				}
			} else if (this.parameters.default === 'variable_currentYear' && !this.dataOriginal) {
				this.dataToEdit = new Date().getFullYear()
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/componets/inputField.scss';
</style>
