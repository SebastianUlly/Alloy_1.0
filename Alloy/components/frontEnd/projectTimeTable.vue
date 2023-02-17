<template>
    <div>
        <v-data-table 
            v-if="selectedProjectId"
            :headers="headers"
            :items="items"
        />
    </div>
</template>

<script>
import gql from "graphql-tag";

export default{
    props: {
        selectedProjectId:{
            type: String
        }
    },
    apollo:{
        getAllUser: gql`
            query getAllUser {
                getAllUser{
                    userId
                    data
                }
            }
        `,
        miscellaneousById: gql`
            query miscellaneousById {
                miscellaneousById(id: "c813e170-3369-4f4c-bc74-87be5c5cef15"){
                    data
                    id
                    label
                }
            }
        `
    },
    data(){
        return{
            headers:[
                {
                    text: "Mitarbeiter",
                    sortable: false,
                    value: "mitarbeiter",
                    
                },
                {
                    text: "Datum",
                    sortable: false,
                    value: "datum"
                },
                {
                    text: "Arbeitstyp",
                    sortable: false,
                    value: "arbeitstyp"
                },
                {
                    text: "Beschreibung",
                    sortable: false,
                    value: "beschreibung",
                    maxWidth: "50"
                },
                {
                    text: "Zeit",
                    sortable: false,
                    value: "zeit"
                }
            ],
            items:[],
            
        }
    },
    methods:{
        itemsFill(points){
            this.items = [];
            
            for(let point of points){
                 this.items.push({
                    datum: point.data.find(element => element.elementId == "d43d0fd0-172d-4b7a-a942-990597d3cb42")?.data.text,
                    zeit: point.data.find(element => element.elementId == "83f4737a-0d63-407d-bdff-4ff576f97a13").data.text,
                    beschreibung: point.data.find(element => element.elementId == "65138254-8e1f-4b0b-91ae-70540e468459").data.text,
                    mitarbeiter: this.getUserByUserId(point.data.find(element => element.elementId == "b0913291-6fc0-4c10-bf0e-6fa136fbe032").data.text),
                    arbeitstyp: this.getActivityTypeById(point.data.find(element => element.elementId == "9a8284f2-5615-4cb5-893b-56cc3476b169").data.text)
                })
            }    
        },
        getActivityTypeById(id){
            return this.miscellaneousById.data.find(element => element.id === id).name
        },
        getUserByUserId(id){
            let user = this.getAllUser.find(item => item.userId === id)
            let name = user.data.find(item => item.elementId === "2d1b9f45-61f4-438d-b682-734000022169").data.text + ' ' + user.data.find(item => item.elementId === "7b990f61-122c-4d14-a234-34bd32472c63").data.text
            return name;
        },
        
        async getPointsByProjectId(){
            console.log(this.selectedProjectId)
            const { data } = await this.$apollo.query({
                variables:{
                    userId: this.selectedProjectId
                },
                query: gql `
                    query (
                        $userId: String
                    ){
                        pointsByUserId(
                            userId: $userId
                        ) {
                            data
                            id
                            schemaId
                        }
                    }
                `
            })
            if(data.pointsByUserId.length > 0){
                this.itemsFill(data.pointsByUserId)
            }
        }
    },
    watch:{
        selectedProjectId: {
            handler(){
                this.getPointsByProjectId()
            }
        }
    }
}


</script>

<style>
tbody > tr > td:nth-of-type(4){
  text-overflow: ellipsis;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
}
</style>