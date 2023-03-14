<template>
	<div>
		<div class="top-section">
			<div class="top-section__left">
				<v-btn
					style="min-width:0"
					class="addProject"
					color="green"
					:disabled="popUp"
					:loading="popUpLoading"
					@click="openNewProject(true)"
				>
					<v-icon>
						mdi-timer-plus-outline
					</v-icon>
				</v-btn>
			</div>
		</div>
		<PopUp
			v-if="popUp && popUpSchema"
			@closeNewProject="openNewProject(false)"
			:popUpSchema="popUpSchema"
			:clickedFile="clickedFile"
			@saveSuccess="pointSaved"
			:selectedUserId="selectedUserId"
			:paid-holidays="paidHolidayList"
		/>
	</div>
</template>

<script>
import PopUp from "~/components/frontEnd/lib/popUp";
import { mergeSchemas } from '~/assets/classes/objectClasses'
import gql from "graphql-tag";

export default {
	props: {
		popUpSchemaIds: {
			type: Array,
			required: true
		},
		paidHolidayList: {
			type: Array,
			required: false
		},
		selectedUserId: {
			type: String,
			required: false
		}
	},

	components: {
		PopUp
	},

	data () {
		return {
			popUp: false,
			popUpSchema:{},
			popUpLoading: false
		}
	},

	methods: {
		openNewProject(value){
			this.popUpLoading = true
			this.clickedFile = null;
			this.popUp = value;
			this.getDataForPopUp(this.popUpSchemaIds);
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
			this.popUpLoading = false
		},

		pointSaved () {
			this.popUpLoading = false
			this.popUp = false
			this.clickedFile = null;
			this.$emit('pointSaved')
			// this.getPoints(this.selectedUserId)
		}
	},
}
</script>