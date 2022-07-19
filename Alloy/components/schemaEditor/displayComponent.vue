<template>
	<div>
		<div v-if="element">
			{{ element.label }}
			<v-icon class="edit-button" @click="editElement">
				mdi-file-edit
			</v-icon>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		elementId: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			element: null
		}
	},

	computed: {
		...mapGetters({
			schemaElements: 'schemaEditor/getSchemaElements',
			schemaMetadata: 'schemaEditor/getSchemaMetadata'
		})
	},
	
	watch: {
		schemaElements: {
			deep: true,
			handler () {
				this.getData()
			}
		},

		schemaMetadata: {
			deep: true,
			handler () {
				this.getData()
			}
		}
	},

	mounted() {
		this.getData()
	},

	methods: {
		editElement() {
			this.$store.commit("schemaEditor/setElementIdToEdit", this.elementId);
		},

		getData () {
			const element = this.schemaElements.find(item => item.elementId === this.elementId)
			if (element) {
				this.element = element
			} else {
				const element = this.schemaMetadata.metadata_elements.find(item => item.elementId === this.elementId)
				this.element = element
			}
		}
	}
};
</script>

<style scoped>

</style>