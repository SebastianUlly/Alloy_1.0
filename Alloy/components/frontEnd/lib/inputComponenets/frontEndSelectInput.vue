<template>
    <div class="body">
        <!-- the label of the select input componenet -->
        <div class="label">
            {{label}}
        </div>
        <div class="inputDiv">
            <!-- the selector loads the select options -->
            <select class="myInput" v-model="inputValue" type="text">
                <!-- writing out the optioins -->
                <option
                v-for="(item, index) in files"
                :value="item"
                >{{item}}</option>
            </select>
        </div>
        <!-- dropdown arrow -->
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
        },
        elementIdToSearch:{
            type: String
        },
        data:{
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
        setValue(){
            if(this.elementIdToSearch && this.elementId !=="75e96f94-0103-4804-abc0-5331ea980e9b" && this.data != undefined){
                this.inputValue = (this.data.data.find(item => item.elementId === this.elementId).data.text)
            }
        },
        //sending the selected data to the store
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
            if(this.parameters.default){
                this.inputValue = this.parameters.default;
            }
            //querying the Apotheken of the selectable schema
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
            //filling the files array with the data of fileBySchemaId.data where elementData.elementId (name field of an apotheke) is the same
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
            //if its not an pharmacy than fills it with the parameters.options from the parent component
            }else if(this.parameters.options)
            {
                this.files = this.parameters.options
            }
        }
    },
    mounted(){
        this.getfile();
        this.setValue();
    },
    watch:{
        //if the input value changes calls the sendEvent
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