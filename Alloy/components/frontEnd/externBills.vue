<template>
    <div class="top-sectioin__left">
        <v-btn
            style="min-width:0"
            class="addProject"
            color="green"
            @click="openNewBill(true)"
        >
            <v-icon>
                mdi-note-text-outline
            </v-icon>
        </v-btn>
        <popUp
            v-if="popUp && popUpSchema"
            @closeNewProject="openNewBill(false)"
            :popUpSchema = "popUpSchema"
            :clickedFile = "clickedFile"
        />
    </div>

</template>

<script>
import gql from "graphql-tag";
import popUp from "~/components/frontEnd/lib/popUp";
import { mergeSchemas } from '~/assets/classes/objectClasses'
export default {
    components:{
        popUp
    },
    data(){
        return{
            popUp: false,
            popUpSchema: null,
            clickedFile:"",
            popUpLoading: false
        }
    },
    methods:{
        openNewBill(value){
			this.getDataForPopUp(["3d77d406-691c-4b0f-9baf-1380b1390c0d"]);
			this.popUpLoading = true
			this.$store.commit("file/resetEnteredData")
			this.clickedFile = null;
			this.popUp = value;
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
    }
}


</script>

<style>
.top-section__left{
	margin-top: 30px;
	max-width: 900px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>