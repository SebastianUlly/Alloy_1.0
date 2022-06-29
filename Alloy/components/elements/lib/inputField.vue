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
			:title="dataToEdit"
			type="text"
			:placeholder="placeholder"
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
		<div class="results" v-if="result.length">
			<div v-for="item of result">
				{{item}}

			</div>

		</div>
		<vue-json-pretty :data="parameters.elementToWatch" />
	</div>
</template>

<script>
import { getConsecutiveNumber } from '~/assets/functions/consecutiveNumber'
import { mapGetters } from 'vuex'
import ZipCodeList from '~/zipCodeList.json'

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
			dataToEdit: '',
			placeholder: "...",
			dataToWatch: '',
			result: [],
			isResult: false
		}
	},

	computed: {
		...mapGetters({
			directory: 'directory/getDirectory',
			clickedEntityId: 'directory/getClickedEntityId',
			fileData: 'file/getDataToSave'
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
		},

		fileData: {
			deep: true,
			handler () {
				this.getDataToWatch()
			}
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
		},

		getDataToWatch () {
			this.dataToWatch= this.fileData.find(item => item.elementId === this.parameters.elementToWatch)?.data?.text;
			const res = ZipCodeList.data.filter((item) => item?.plz?.toString().startsWith(this.dataToWatch));
			for (const obj of res) {
				this.result.push(obj.plz)
			}
			console.log(ZipCodeList.data.filter((item) => item?.plz?.toString().startsWith(this.dataToWatch)));
			if(this.result){
				this.isResult = true
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/componets/inputField.scss';
.results{
	position: absolute;
	display:none;
	width: 93%;
	height: 100px;
	background-color: #1E1E1E;
	z-index: 1;
	border: 1px solid white;
	border-radius: 4px;
}
.input input:focus ~ .results{
	display: block;

}
</style>
