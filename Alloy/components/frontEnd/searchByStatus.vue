<template>
    <div
		class="selectStatusBackground"
	>
        <select
			v-model="status"
			class="selectStatus"
			name=""
			id=""
		>
        <option value="" class="selectStatusOption" disabled selected>Status</option>
        <option class="selectStatusOption" value="">Alle</option>
            <option
				v-for="item in statuses"
				class="selectStatusOption"
				:value="item"
				:key="item"
			>
				{{ item }}
			</option>
        </select>
	</div>
</template>

<script>
import gql from "graphql-tag";
export default{
    data() {
        return {
            statuses: [],
            status: ''
        }
    },
    created(){
        this.getStatuses()
    },
    watch: {
		status () {
			this.$emit('sendStatus', this.status)
		}
	},
    methods: {
        getStatuses(){
            this.$apollo.query({
                variables:{
                    querySchemaByIdId: "44111b55-c2b8-4e30-97d3-452aed86c1f4"
                },
                query: gql`
                    query QuerySchemaById($querySchemaByIdId: String) {
                        querySchemaById(id: $querySchemaByIdId) {
                            elements
                        }
                    }
                `
            }).then((data) => {
                for(let status of data.data.querySchemaById.elements.find(element => element.elementId === 'ad0ecf0d-bfe2-4d34-9ceb-df9cac26cd2a').parameters.options){
                    //console.log(data.data.querySchemaById.elements.find(element => element.elementId === 'ad0ecf0d-bfe2-4d34-9ceb-df9cac26cd2a').parameters.options)
                    this.statuses.push(status)
                }
            })
        }
    }
}
</script>

<style scoped>

.selectStatusBackground {
	background-color: #1E1E1E;
	height: 50px;
	width: 150px;
	display: flex;
    align-items: center;
    justify-content: center;
	border-radius: 2px;
}

.selectStatus {
	border: solid 1px white;
	border-radius: 4px;
	width: 86%;
	height: 70%;
	color: white;
    text-align: left;
	padding-left: 15px;
}

.selectStatusOption {
	background-color: #1E1E1E;
}



</style>