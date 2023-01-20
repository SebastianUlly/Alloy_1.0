<template>
    <div class="popUp">
        <div class="popUpTop">
            <div class="infoIcon">
                <v-icon>
                    mdi-delete-outline
                </v-icon>
            </div>
            <div class="label">
                Löschen bestätigen
            </div>
            <div class="closeIcon">
                <button  @click="closePopUp()">
                    <img :src="closeButtonImage" alt="">
                </button>
            </div>
        </div>
        <div class="popUpBody">
            <div class="textContainer">
                {{clickedFile.Datum}} - {{ clickedFile.Typ }} - {{ clickedFile.Projekt }} - {{ clickedFile.Ttigkeit }} - {{ clickedFile.Zeit }} <br><br>{{ clickedFile.Beschreibung }}
            </div>
        </div>
        <div class="addButtonDiv">
            <!-- emitting the clicked answer to the parent -->
            <v-btn
                class="addButton"
                @click="$emit('sendAnswer', true)"
                color="green"
                large
                style="min-width:0"> Löschen 
            </v-btn>
            <v-btn
                class="addButton"
                @click="$emit('sendAnswer', false)"
                color="green"
                large
                style="min-width:0"> Nein 
            </v-btn>
        </div>
    </div>
</template>

<script>
import closeButtonImage from '~/assets/images/close-button.png'
export default {
    props:{
        clickedFile:{
            type: Object
        }
    },
    data(){
        return{
            closeButtonImage: closeButtonImage
        }
    },
    methods:{
        closePopUp(){
            this.$emit('closePopUp', false);
        }
    },
}

</script>

<style lang="scss" scoped>
$gap-size: 15px;
$columns: 12;

.popUp{
    position: absolute;
    top: 300px;
    left: 15%;
    z-index: 2;
    margin: 30px;
    border-radius: 3px;
    height: auto;
    width: 425px;
    background-color: #4D4D4D;
    justify-content: center;
    text-align: center;
    box-shadow: 25px 25px 40px rgba(0, 0, 0, 0.78), -25px -25px 40px rgba(0, 0, 0, 0.756);
    animation: slideIn 0.2s ease-in;
} 
@keyframes slideIn {
  0% {
    opacity: 0;
    //height: 1px;
  }
  100% {
    //height: fit-content;
    opacity: 1;
  }
}
.popUpTop{
    position: relative;
    height: 42px;
    width: 425px;
    background-color:#282828;
    border-start-start-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 8px;
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
.closeIcon{
    height:24px;
    width:24px;
}
.closeIcon img{
    width: 100%;
    height:auto;
}
.textContainer{
  
  flex-wrap: wrap;
  width: 100%;
  text-align: center;
}
.empty{
    opacity: 0;
}
.inputAlignCenter{
    align-items: center;
}
.inputAlignRight{
    align-items: right;
}
</style>