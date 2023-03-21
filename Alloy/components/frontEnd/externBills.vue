<template>
	<div>
		<div class="top-section__left">
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
		<v-data-table
			v-if="headers && items"
			:headers="headers"
			:items="items"
		>
		</v-data-table>
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
            popUpLoading: false,
			headers: [],
			items: [],
			companyList:[]
        }
    },
	apollo:{
		querySchemaById: gql`
			query PreviewList {
				querySchemaById(id: "18eaf9b4-0b4f-4c1b-be64-03af92755f9d") {
					label
					metadata
					elements
				}
			}
		`,
		fileBySchemaId: gql`
			query fileBySchemaId {
				fileBySchemaId(schemaId: "18eaf9b4-0b4f-4c1b-be64-03af92755f9d"){
					id
					label
					data
				}
			}
		`,

	},
	created(){
		this.headersFill()
		this.itemsFill()
		this.getCompanyList()
	},
    methods:{
		async getCompanyList(){
			this.companyList = await this.$apollo.query({
				variables:{
					schemaId: "5c72ebd0-b040-4fd7-b672-05ec865f3fef"
				},
				query: gql`
					query($schemaId: String ){
						fileBySchemaId(schemaId: $schemaId){
							label
							data
							id
						}
					}
				`
			})
			console.log(this.companyList.data.fileBySchemaId)
		},
		headersFill(){
			if(this.querySchemaById){
				this.headers = []
				for (const elementIdToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList) {
					this.headers.push({
						text: this.querySchemaById.elements.find(element => element.elementId === elementIdToFind)?.label,
						align: 'center',
						sortable: false,
						value: this.querySchemaById.elements.find(element => element.elementId === elementIdToFind)?.label.replace(/[^a-zA-Z ]/g, ""),
						elementId: elementIdToFind,
					})
				}
				this.headers.push({
					text: 'Rechnungsnummer',
					align: 'center',
					sortable: false,
					value: 'rechnungsnummer',
					elementId: '23f134e2-9904-4ed1-b6bf-8a2fb4a6ad3d',
				})
			}
		},
		itemsFill(){
			if(this.fileBySchemaId){
				for(const rawItem of this.fileBySchemaId){
					console.log(rawItem)
					let newRow = {}
					for(const elementToFind of this.querySchemaById.metadata.metadata_elements[0].parameters.previewList){
						console.log(rawItem, "rawItem")
						let currentItem = rawItem.data.find(item => item.elementId === elementToFind);
						let currentKey= this.headers.find(item => item.elementId === elementToFind)?.value;
						console.log(currentItem, "currentItem")
						let currentValue = ''
						if(currentItem){
							if(currentItem.id === '3d77d406-691c-4b0f-9baf-1380b1390c0d'){
								currentValue = this.companyList.find(element => element.elementId === currentItem.data.text).label
							}
							currentValue = currentItem.data.text
						}
						
						if(currentItem && currentKey){
							newRow[currentKey] = currentValue;
							if(rawItem.label){
								newRow['rechnungsnummer'] = rawItem.label
							}
						}
					}
					newRow['id'] = rawItem.id
					this.items.push(newRow)
				}
			}
		},
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