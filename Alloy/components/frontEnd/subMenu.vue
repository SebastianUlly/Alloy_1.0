<template>
    <div class="main">
        <v-btn-toggle
            dense
            :borderless= true
        >
            <v-btn
                @click="openComponent('projektListe')"
            >
                Projektliste
            </v-btn>
            <v-spacer/>
            <v-btn
                @click="openComponent('zeiterfassung')"
            >
                Zeiterfassung
            </v-btn>
            <v-btn
                @click="openComponent('projectsummary')"
            >
                Projektübersicht
            </v-btn>
            <v-btn
                @click="openComponent('externBills')"
            >
                Externe Rechnungen
            </v-btn>
        </v-btn-toggle>
    </div>
</template>

<script>
export default{
    methods:{
        openComponent(component){
            this.$emit('sendComponentToFrontEnd', component)

        }
    }
}
</script>

<style>
.main{
    background-color: #272727;
    height: 50px;
    align-items: center;  
    display: flex;
    width: 900px;
    padding: 0 5px;
}
</style>

