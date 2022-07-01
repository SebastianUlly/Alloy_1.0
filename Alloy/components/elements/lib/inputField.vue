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
			@click="inputClicked()"
			v-model="dataToEdit"
			:title="dataToEdit"
			type="text"
			:placeholder="placeholder"
			:class="parameters.editable === false ? 'input__field-disabled' : 'input__field'"
			:disabled="parameters.editable === false ? true : false"
			ref = "input"
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
		<div ref="results" class="results" v-if="result.length">
			<div @click="optionClicked(item)" class="options"  v-for="item of result">
			
			{{item}}
			
			</div>

		</div>
		<!-- <vue-json-pretty :data="parameters.elementToWatch" /> -->
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
		inputClicked(){
			this.$refs.results.classList.replace("resultsDisplayNone","results");
		},
		optionClicked(item){
			this.dataToEdit = item;
			this.$refs.results.classList.replace("results","resultsDisplayNone");
		},
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
				this.result.push(obj.ort)
			}
		/* 	console.log(ZipCodeList.data.filter((item) => item?.plz?.toString().startsWith(this.dataToWatch))); */
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
	position:absolute;
	display:flex;
	display:none;
	max-width: 100%;
	max-height: 250px;
	background-color: #1E1E1E;
	z-index: 2;
	border: 1px solid white;
	border-radius: 4px;
	overflow: scroll;
	overflow-x: hidden;
	box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.452);

}
.resultsDisplayNone{
	display: none;
}
.options{
	padding: 4px 0;
	padding-left: 15px;
	z-index: 2;
}
 .input:hover .results:hover, .input input:focus ~ .results{
	display: block;
}
.options:hover{
	background-color: grey;
}



::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(83, 83, 83);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(155, 155, 155);
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(141, 141, 141);
}
::-webkit-resizer{
	display: none;
}
::-webkit-scrollbar-corner{
	display: none;
}
</style>
