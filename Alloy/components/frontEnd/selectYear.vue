<template>
    <div class="selectYearBackground">
        <input v-model="year" type="text" class="selectYear" placeholder="Jahr">
        <!-- <select v-model="year" class="selectYear" name="" id="">>
            <option v-for="item in availableYears" class="selectYearOption" :value="item" :key="item">{{item}}</option>
        </select> -->
         <!-- <vue-json-pretty :data="availableYears"/> -->
	</div>
</template>
<script>
import gql from "graphql-tag";
export default {
    data() {
        return {
           year:"",
           /* availableYears:[] */
        };
    },
    methods:{
         /* searchAvailableYears(){
            for(let item of this.fileBySchemaId){
                for(let i = 0; i < item.data.length; i++){
                    if(item.data[i].elementId === "577aa568-345a-47e5-9b71-848d5695bd5d" && !this.availableYears.includes(item.data[i].data.text.toString())){
                        this.availableYears.push(item.data[i].data.text.toString());
                    }
                }
                
            }
        } */
    },
    created(){
        /* this.searchAvailableYears(); */
    },
    apollo:{
         /* fileBySchemaId: gql `
			query Files {
				fileBySchemaId(schemaId: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
					label
					data
					id
				}
			}
		`, */
    },
    watch:{
        year:{
            handler(){
                this.$emit('sendYear', this.year)
                /* this.searchAvailableYears(); */
            }
        }
    }
}
</script>

<style scoped>
.selectYearBackground{
	background-color: #1E1E1E;
	height: 50px;
	width:90px;
	display: flex;
    align-items: center;
    justify-content: center;
	border-radius: 2px;
}
.selectYear{
	border: solid 1px white;
	border-radius: 4px;
	width:86%;
	height: 70%;
	color: white;
	padding-left: 5px;
	padding-top: 2px;
}
.selectYearOption{
	background-color:#1E1E1E;
}
</style>