<template>
    <div class="popUp">
        <div class="popUpTop">
            <span class="infoIcon">
                <v-icon>
                    mdi-note-plus-outline
                </v-icon>
            </span>
            <span class="label">
                Projekt hinzufügen
            </span> 
            <span  class="closeIcon">
                <div class="whiteBackground">
                </div>
                <button
                @click="closeNewProject()"
                >
                    <v-icon color="red" large>
                        mdi-close-box
                    </v-icon>
                </button>
            </span>
        </div>
        <div class="popUpBody">
            <div class="inputContainer">
                <frontEndInput class="col-6th"/>
                <frontEndInput class="col-6th"/>
                <frontEndSelectInput class="col-3th"/>
                <frontEndInput class="col-3th"/>
                <frontEndInput class="col-1th"/>
            </div>
        </div>
        <div class="addButtonDiv">
            <v-btn class="addButton" color="green" large style="min-width:0"> Projekt hinzufügen</v-btn>
        </div>
          <!-- <vue-json-pretty :data="nestedArray" /> -->
    </div>
</template>

<script>
import gql from "graphql-tag"
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from "uuid"
import { NestedArray } from '~/assets/classes/arrayClasses'
import frontEndInput from '~/components/frontEnd/lib/inputComponenets/frontEndInput'
import frontEndSelectInput from '~/components/frontEnd/lib/inputComponenets/frontEndSelectInput'
export default {
    components:{
        frontEndInput,
        frontEndSelectInput,
},
    data(){
        return{
            payload:"",
            nestedArray: null,
            nestedArrayElements: null
        }
    },
    methods:{
        closeNewProject(){
            this.$emit('closeNewProject', false)
        },
        createNewFile () {
            
            this.$store.commit(file => setFile, payload)
        },
        createNewFileId(){
            const newId = uuidv4();
        }
    },
    created() {
        this.createNewFileId();
    },
    apollo:{
        querySchemaById: gql `
			query PreviewList {
				querySchemaById(id: "44111b55-c2b8-4e30-97d3-452aed86c1f4") {
                    id
					label
					metadata
					elements
				}
			}
		`
    }, 
    computed: {
		...mapGetters({
			schemaMetadata: 'schema/getSchemaMetadata'
		})
	},
    watch: {
        querySchemaById: {
			deep: true,
			handler () {
				this.nestedArray = new NestedArray(this.querySchemaById.metadata.metadata_elements, 'elementId', undefined).nestedArray;
                this.nestedArrayElements = new NestedArray(this.querySchemaById.elements, "elementId", undefined).nestedArray
			}
		} 
	}
}

</script>

<style lang="scss" scoped>
$gap-size: 15px;
$columns: 12;
.popUp{
    position: absolute;
    top: 300px;
    left: 25%;
    z-index: 2;
    margin: 30px;
    border-radius: 3px;
    height: auto;
    width: 425px;
    background-color: #4D4D4D;
    justify-content: center;
    text-align: center;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
} 
.popUpTop{
    position: relative;
    height: 41px;
    width: 425px;
    background-color:#282828;
    border-start-start-radius: 3px;
    text-align: center;
    justify-content: center;
    display: table-cell; 
    vertical-align: middle;
    padding: 0 10 0 10;
}
.popUpBody{
    padding: 34px 22px;
}
.addButtonDiv{
    margin-bottom: 20px;
}
.label{
    font-size: 20px;
}
.infoIcon{
    float: left;
    margin-top: 5px;
    margin-left: 9px;
}
.closeIcon{
    float: right;
    margin-right: 3px;
}
.whiteBackground{
    position: absolute;
    right: 10px;
    top: 10px;
    height: 20px;
    width: 20px;
    background-color: white;
}
.inputContainer{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: $gap-size;
}
@mixin col-x-list {
  @for $i from 1 through $columns {
    @for $j from 1 through $i {
      .col-#{$j}-#{$i}th {
        width: calc(calc(calc(100% - calc(#{$gap-size / #{$j}} * #{$i - $j})) / #{$i}) * #{$j});
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
      }
    }
    .col-#{$i}th {
        width: calc(calc(100% - calc(#{$gap-size} * #{$i - 1})) / #{$i});
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
      }
   } 
}
@include col-x-list;
</style>