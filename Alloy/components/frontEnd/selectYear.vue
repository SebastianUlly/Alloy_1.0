<template>
    <div class="selectYearBackground">
        <select v-model="year" class="selectYear" name="" id="">>
            <option v-for="item in availableYears" class="selectYearOption" :value="item" :key="item">{{item}}</option>
        </select>
	</div>
</template>
<script>
export default {
    data() {
        return {
           year:"",
           availableYears:["2022", "2023", "2024"]
        };
    },

    created () {
        this.year = new Date().getFullYear();
    },

    watch: {
        year: {
            handler () {
                this.$emit('sendYear', this.year.toString())
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
    text-align: center;
}
.selectYearOption{
	background-color:#1E1E1E;
}
</style>