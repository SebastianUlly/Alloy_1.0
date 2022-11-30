<template>
	<div class="container">
		<add-button
			@openPopUp="openNewPopUp"
		/>
		<popUp
			v-if="popUp && popUpSchema"
			:popUpSchema = "popUpSchema"
			:clickedFile = "clickedFile"
		/>
	</div>
</template>

<script>
import AddButton from './lib/AddButton.vue';

export default {
	components: {
		AddButton
	},

	data () {
		return {
			clickedFile: '',
			popUpSchema: null
		}
	},

	methods: {
		openNewPopUp () {

		},

		async getDataForPopUp(id){
			let schemas = [];
			// this.popUpSchema has to empty every time a new schema has to be loaded
			this.popUpSchema = null;
			//query the both schema
			for(const item of id){
				await this.$apollo.query({
					variables:{
						id: item
					},
					query: gql`
						query($id: String){
							querySchemaById( id: $id){
								id
								label
								metadata
								elements
							}
						}
					`
				}).then((data) => {
					//if both schemas are loaded, sending them to the mergeSchemas function to merge
					schemas.push(data.data.querySchemaById)
					if(id.length === schemas.length && id.length !== 1){
						this.popUpSchema = mergeSchemas(schemas[0], schemas[1]);
					}else if(id.length === 1){
						this.popUpSchema = data.data.querySchemaById;
					}
				})
			}
		},
	}
}
</script>
