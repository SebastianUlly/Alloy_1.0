<template>
    <div class="body">
        <div class="label">
            {{label}}
        </div>
        <div class="inputDiv">
            <select class="myInput" v-model="inputValue" type="text">
                <option disabled selected value="default"></option>
                <option
                v-for="(item, index) in files"
                :value="item"
                >{{item}}</option>
            </select>
        </div>
        <v-icon class="mdi-chevron">mdi-chevron-down</v-icon>
    </div>
</template>
<script>
import gql from "graphql-tag";
export default{
    props: {
        elementId: {
            type: String
        },
        label: {
            type: String
        },
        parameters:{
            type: Object
        }
    },
    data(){
        return{
            files:[],
            inputValue: ""
        }
    },
    methods:{
        sendEvent(){
            const payload = {
                elementId: this.elementId,
                data:{
                    text : this.inputValue
                } 
            }
            this.$emit('update', payload);
        },
        //get the file by the schema of parameters
        getfile() {
            if(this.parameters?.selectableSchema){
                this.$apollo.query({
                variables: {
                    schemaId: this.parameters?.selectableSchema,
                },
                query: gql`
                    query ($schemaId: String) {
                        fileBySchemaId(schemaId: $schemaId) {
                            id
                            label
                            data
                        }
                    }
                `,
            //filling the files array with the data of elementData.elementId
            }).then((data) => {
                const temp = data.data.fileBySchemaId;
                this.files = temp.map(
                    function (item, index, array) {
                        return item.data.find(
                            (elementData) => elementData.elementId === "91f42e63-98b4-462b-bf65-58b416718cb0"
                        )?.data?.text;
                    }
                )

            }).catch((error) => {
                console.log({ error });
            });
            }else if(this.parameters.options)
            {
                this.files = this.parameters.options
            }
            

        }
    },
    mounted(){
        this.getfile();
    },
    watch:{
        inputValue:{
            handler(){
                this.sendEvent();
            }
        }
    }
}
</script>
<style scoped>
.body{
    margin-bottom: 10px;
    position: relative;
    width:100%;
}
.inputDiv{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(255, 255, 255);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.myInput:focus-visible{
    outline: none;
}
.myInput{
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    padding-left: 10px;
    padding-top: 4px;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.label{
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
option{
    background-color:#282828;
    color: white;
}
.mdi-chevron{
    position: absolute;
    right: 10px;
    top: 4px;
}
</style>