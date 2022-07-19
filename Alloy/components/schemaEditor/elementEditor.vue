<template>
	<div>
		<div v-if="element">
			<LabelEditor
				:element="element"
				@update="setLabel"
			/>
			<input type="checkbox" v-model="required">

			<button class="save-button" @click="saveElement">
				Element speichern
			</button>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import LabelEditor from './elementEditor/labelEditor.vue'

export default {
	components: {
		LabelEditor
	},

	data () {
		return {
			element: null
		}
	},

	computed: {
		...mapGetters({
			elementToEdit: 'schemaEditor/getElementToEdit',
			schemaElements: 'schemaEditor/getSchemaElements',
			schemaMetadata: 'schemaEditor/getSchemaMetadata'
		})
	},

	watch: {
		elementToEdit: {
			deep: true,
			handler () {
				this.startFunction()
			}
		},

		required () {
			const payload = {
				required: this.required
			}
		}
	},

	methods: {
		setLabel (data) {
			// 	.$store.commit('schemaEditor/setLabelOfElement', data)
		},

		saveElement () {
			console.log(this.element)
		},

		startFunction () {
			this.element = JSON.parse(JSON.stringify(this.elementToEdit))
		}
	},
}
</script>

<style lang="scss" scoped>
.save-button {
	position: absolute;
	bottom: 10px;
	border: white solid 2px;
	border-radius: 4px;
	padding: 10px 20px;
}
</style>