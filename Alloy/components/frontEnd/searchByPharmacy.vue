<template>
    <div
		class="selectPharmacyBackground"
	>
        <select
			v-model="pharmacy"
			class="selectPharmacy"
			name=""
			id=""
		>
        <option value="" class="selectPharmacyOption" disabled selected>Apotheke</option>
        <option class="selectPharmacyOption" value="">Alle</option>
            <option
				v-for="item in pharmacies"
				class="selectPharmacyOption"
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

export default {
    data() {
        return {
            pharmacies: [],
            pharmacy: ''
        }
    },
    created(){
        this.getPharmacies()
    },
    watch: {
		pharmacy () {
			this.$emit('sendPharmacy', this.pharmacy)
		}
	},
    methods: {
        getPharmacies(){
            this.$apollo.query({
                variables:{
                    schemaId: "961fe75d-2d0e-4ccb-8afd-cde072b37380"
                },
                query: gql`
                    query FileBySchemaId($schemaId: String) {
                    fileBySchemaId(schemaId: $schemaId) {
                        data
                        id
                        label
                        }
                    }
                `
            }).then((data) => {
                for(const pharmacy of data.data.fileBySchemaId){
                    this.pharmacies.push(pharmacy.data.find(data => data.elementId === '91f42e63-98b4-462b-bf65-58b416718cb0').data.text)
                }
            })
        }
    }
}
</script>

<style scoped>
.selectPharmacyBackground {
	background-color: #1E1E1E;
	height: 50px;
	width: 120px;
	display: flex;
    align-items: center;
    justify-content: center;
	border-radius: 2px;
}

.selectPharmacy {
	border: solid 1px white;
	border-radius: 4px;
	width: 86%;
	height: 70%;
	color: white;
    text-align: left;
	padding-left: 15px;
}

.selectPharmacyOption {
	background-color: #1E1E1E;
}



</style>