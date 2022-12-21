<template>
    <!-- vuetify datePicker component -->
    <div class="dateInputMain">
        <span class="label">{{ label }}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    class="inputDate"
                    v-model="dateDE"
                    readonly
                    v-bind="attrs"
                    v-on="on"  
                ></v-text-field>
            </template>
            <v-date-picker
                no-title
                v-model="dateEN"
                @input="menu = false"
            ></v-date-picker>
        </v-menu>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { checkPermissionId } from '~/assets/functions/permission'
export default{
    props: {
        elementId:{
            type: String
        },
        label:{
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
        },
        permissions:{
            type: Object
        }
    },
    data(){
        return{
            dateText:"",
            //two variables are needed, one for the component and one for the German format
            dateEN: "",
            dateDE: "",
            formattedDate:"",
            menu: false
        }
    },
    methods:{
        //set the default value for the input if elementIdToSearch not exists
        setDefaultValue(){
            this.dateEN = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
            this.dateDE = this.convertDateEngToDe(this.dateEN)
            if(this.elementIdToSearch && this.data != undefined){
                this.dateEN = this.convertDateDeToEng(this.data.data.find(item => item.elementId === this.elementId).data.text)
                this.dateDE = this.data.data.find(item => item.elementId === this.elementId).data.text
            }
        },
        //converting the dateEn to dateDe
        convertDateEngToDe(date){
            const [year, month, day] = date.split('-')
            return (day + "." + month + "." + year)
        },
        convertDateDeToEng(date){
            const [day, month, year] = date.split('.')
            return (year + "-" + month + "-" + day)
        },
        //checks if the permissionId is in the permissionIds list and sends the permissionId to the checkPermissionId function
        checkPermissionIdsHere (arg) {
			if (this.permissionIds) {
				return checkPermissionId(this.permissionIds, arg)
			}
			return false
		},
        //check if the permissions.toEdit is a boolean or a permissionId
        setEditable(value){ 
            if(typeof value === "boolean"){
                return !value
            } 
            //if it is not a boolean, than use the checkPermissionIdsHere function to return a value
            else{
                return !this.checkPermissionIdsHere(value);
            }
        },
        //sends the payload to the parent
        sendEvent(){
            //formatting the date data and emitting it
            const [year, month, day] = this.dateEN.split('-')
            const temp = day + '.' + month + '.' + year
            const payload = {
                elementId: this.elementId,
                data:{
                    text : temp
                }
            }
            this.$emit('update', payload);
        },
    },
    mounted(){
        //send the default date to the store
        this.sendEvent();
    },
    created(){
        this.setDefaultValue();
        this.setEditable();
    },
    computed:{
        ...mapGetters({
            permissionIds: 'authentication/getPermissionIds'
        })
    },
    watch: {
        //when the value of the data changes call the send event function and send the value to the store
        dateEN:{
            handler(){
                this.sendEvent();
                this.dateDE = this.convertDateEngToDe(this.dateEN);
            }
        }
    } 
}
</script>
<style scoped>
.dateInputMain{
    position: relative;
}
.inputDate{
    padding-left:10px;
    margin-top:0;
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.label{
    color: white;
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
}
.v-text-field {
    padding-top: 0 !important;
}
.v-text-field > .v-input__control > .v-input__slot:before, .v-text-field > .v-input__control > .v-input__slot:after{
    border-style:none
}
.v-text-field > .v-input__control > .v-input__slot:after {
    border-style: none;
}
</style>