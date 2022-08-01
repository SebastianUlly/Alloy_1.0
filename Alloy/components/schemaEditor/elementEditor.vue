<template>
	<div>
		<div v-if="element">
			<LabelEditor
				:element="element"
				@update="setLabel"
			/>
			
			<div v-for="(item, index) of Object.keys(element.parameters)" :key="index">
				<component
					:is="item"
					:data-of-property="element.parameters[item]"
					@update="updateProperty"
				/>
			</div>


			<button class="save-button" @click="saveElement">
				Element speichern
			</button>
			<button
				:disabled="JSON.stringify(element) === JSON.stringify(elementToEdit)"
				:style="(JSON.stringify(element) === JSON.stringify(elementToEdit)) ? 'opacity: 0.4' : 'opacity: 1'"
				class="reset-button" @click="resetElement"
			>
				Reset Element
			</button>

			<vue-json-pretty :data="element" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import LabelEditor from './elementEditor/labelEditor.vue'
import required from './elementEditor/required.vue'

export default {
	components: {
		LabelEditor,
		required
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
			this.element.label = data
		},

		saveElement () {
			this.$store.commit('schemaEditor/setElementOfSchema', this.element)
			this.$store.commit("schemaEditor/setElementIdToEdit", this.element.elementId);
		},

		resetElement () {
			this.startFunction()
		},

		startFunction () {
			this.element = JSON.parse(JSON.stringify(this.elementToEdit))
		},

		updateProperty (data) {
			this.element.parameters[data.key] = data.value
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

.reset-button {
	position: absolute;
	bottom: 10px;
	right: 10px;
	border: white solid 2px;
	border-radius: 4px;
	padding: 10px 20px;
}
</style>