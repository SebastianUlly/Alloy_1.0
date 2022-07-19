<template>
	<div class="wrapper">
		<v-card class="container">
			<div class="input-container" v-if="schema">
				<label for="">Schemaname: </label>
				<select
					v-model="schemaSelect"
					id="selector"
					class="label-input"
				>
					<option value="">
						...
					</option>
					<option
						v-for="(item, index) of schema"
						:key="index"
						:value="item.id"
					>
						{{ item.label }}
					</option>
				</select>
			</div>
			<div class="input-container">
				<label for="">Schemaname: </label>
				<input type="text" v-model="enteredLabel" class="label-input">
			</div>
			<div class="input-container">
				<label for="">Schemagruppe: </label>
				<input type="text" v-model="enteredGroup" class="label-input">
			</div>
			<div class="input-container">
				<label for="">isLeaf:</label>
				<input type="checkbox" v-model="isLeaf" class="leaf-select">
			</div>
			<button @click="newSchema()">
				Neues Schema
			</button>
			<div class="elements-container">
				<MetadataToEdit />
				<ElementsToEdit />
			</div>

			<button @click="saveSchema()">
				Schema speichern
			</button>
		</v-card>
		<v-card class="container">
			<ElementEditor />
		</v-card>
		<!-- <vue-json-pretty :data="schemaMetadata" /> -->
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'

import MetadataToEdit from './metadataToEdit.vue'
import ElementsToEdit from './elementsToEdit.vue'
import ElementEditor from './elementEditor'

export default {
	apollo: {
		schema: gql`
			query Schemes {
				schema {
					id
					label
					metadata
				}
			} 
		`
	},

	components: {
		MetadataToEdit,
		ElementsToEdit,
		ElementEditor
	},

	data () {
		return {
			enteredLabel: '',
			enteredGroup: '',
			isLeaf: false,
			schemaSelect: null
		}
	},

	computed: {
		...mapGetters({
			schemaId: 'schemaEditor/getSchemaId',
			schemaLabel: 'schemaEditor/getSchemaLabel',
			schemaMetadata: 'schemaEditor/getSchemaMetadata',
			schemaElements: 'schemaEditor/getSchemaElements',
			schemaLayout: 'schemaEditor/getSchemaLayout',
			schemaFromStore: 'schemaEditor/getSchema'
		})
	},

	watch: {
		enteredLabel () {
			this.$store.commit('schemaEditor/setSchemaLabel', this.enteredLabel)
		},

		enteredGroup () {
			this.$store.commit('schemaEditor/setSchemaGroup', this.enteredGroup)
		},

		isLeaf () {
			this.$store.commit('schemaEditor/setSchemaLeafValue', this.isLeaf)
		},

		schemaSelect: {
			deep: true,
			handler () {
				this.setSchema()
			}
		}
	},

	methods: {
		setSchema () {
			this.$apollo.query({
					variables: {
						id: this.schemaSelect
					},
	
					query: gql`
						query (
							$id: String
						) {
							querySchemaById (
								id: $id
							) {
								id
								label
								metadata
								elements
								layout
							}
						}
					`
				}).then((data) => {
					this.$store.commit('schemaEditor/setSchemaId', data.data.querySchemaById.id)
					this.$store.commit('schemaEditor/setSchemaLabel', data.data.querySchemaById.label)
					this.$store.commit('schemaEditor/setSchemaMetadata', data.data.querySchemaById.metadata)
					this.$store.commit('schemaEditor/setSchemaElements', data.data.querySchemaById.elements)
					this.$store.commit('schemaEditor/setSchemaLayout', data.data.querySchemaById.layout)
				}).catch((error) => {
					console.log({ error })
				})
		},

		newSchema () {
			this.isLeaf = true
			this.$store.commit('schemaEditor/setNewSchema')
		},

		saveSchema () {
			this.$apollo.mutate({
				variables: {
					id: this.schemaId,
					label: this.schemaLabel,
					metadata: this.schemaMetadata,
					elements: this.schemaElements,
					layout: this.schemaLayout
				},

				mutation: gql`
					mutation (
						$id: String
						$label: String
						$metadata: JSON
						$elements: JSON
						$layout: JSON
					) {
						createSchema (
							id: $id
							label: $label
							metadata: $metadata
							elements: $elements
							layout: $layout
						) {
							id
						}
					}
				`
			}).then((data) => {
				console.log(data)
			}).catch((error) => {
				console.log({ error })
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	justify-content: space-between;
}
.container {
	min-height: 500px;
	width: 50%;
	margin: 0 10px;
}

.input-container {
	margin: 20px 0 ;
	position: relative;
	height: 35px;
	display: flex;
	align-items: center;
}

.label-input {
	border: solid 2px white;
	border-radius: 4px;
	height: 35px;
	width: 300px;
	position: absolute;
	left: 200px;
	color: white;
}

.leaf-select {
	position: absolute;
	left: 200px;
}

.elements-container {
	width: 90%;
}

button {
	padding: 10px 20px;
	border: solid 2px white;
	border-radius: 4px;
}

option {
	color: white;
	background-color: #1e1e1e;
	padding: 10px;
	font-size:17px;
}
</style>