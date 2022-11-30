<template>
    <!-- vuetify datePicker component -->
    <div class="dateInputMain">
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
                    v-model="date"
                    :label="label"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
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
            inputValue:"",
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            menu: false
        }
    },
    methods:{
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
            const [year, month, day] = this.date.split('-')
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
        this.setEditable();
    },
    computed:{
        ...mapGetters({
            permissionIds: 'authentication/getPermissionIds'
        })
    },
    watch: {
        //when the value of the data changes call the send event function and send the value to the store
        date:{
            handler(){
                this.sendEvent();
            }
        }
    } 
}
</script>
<style scoped>
.dateInputMain{
    margin-bottom: 10px;
    position: relative;
}
.inputDate{
    height: 40px;
}
/* .inputDiv{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:white;
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.inputDiv:has(.myInput:disabled){
    border-color:gray;
}
.myInputError{
    height:31px;
    background-color: #282828;
    border-style: solid;
    border-color:rgb(153, 0, 0);
    border-width: thin;
    border-radius: 3px;
    width: 100%;
}
.myInput:focus-visible{
    outline: none;
}
.myInput{
    padding: 3px 5px 0 5px;
    width: 100%;
    color:white;
    outline-offset: 0px;
    outline: none;
}
.myInput:disabled{
    color:gray;
}
.label{
    color: white;
    position:absolute;
    left: 4px;
    top: -15px;
    font-size: 11px;
} */
</style>