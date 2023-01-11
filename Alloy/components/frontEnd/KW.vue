<template>
	<div>
		<div class="top-section">
			<v-btn
				style="min-width:0"
				class="addProject"
				color="green"
				@click="openNewProject(true)"
			>
				<v-icon>
					mdi-timer-plus-outline
				</v-icon>
			</v-btn>
			<!-- <dropDown/> -->
			<selectYear @sendYear="captureMyYear" class="selectYearComponent"/>
			<search @sendValue="captureMySearchValue" />
		</div>
		<popUp
			v-if="popUp && popUpSchema"
			@closeNewProject="openNewProject($event)"
			:popUpSchema="popUpSchema"
			:clickedFile="clickedFile"
			@saveSuccess="pointSaved"
		/>
		<confirmPopUp
			v-if="confirmPopUp"
			:clickedFile = "clickedFile"
			@closePopUp = "setConfirmPopUp"
			@sendAnswer="deletePointFromList"
		/>
		<div
			v-for="(kw, index) of kwListWithPoints.slice().reverse()"
			:key="index"
			class="kw"
		>
			<TableHeader
				v-if="(52 - index) === getCurrentKW"
				:headline="(52 - index).toString() + '. KW'"
				:user-info="{
					workhours: allWorkHoursPerWeek,
					holiday: userMeta.holidays
				}"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'sign'"
				class="tableHeader"
			/>
			<TableHeader
				v-else-if="kw"
				:headline="(52 - index).toString() + '. KW'"
				:user-info="{
					workhours: allWorkHoursPerWeek,
					holiday: userMeta.holidays
				}"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'pdf'"
				class="tableHeader"
			/>
			<zeiterfassung
				v-if="kw"
				:points="kw"
				:year="yearForZeiterfassung"
				:searchValue="searchValueForZeiterfassung"
				@getClickedItem="openEditTime"
				@getClickedItemForDelete="getClickedItemForDelete"
				class="zeiterfassung" 
			/>
		</div>
	</div>
</template>

<script>
import gql from "graphql-tag";
import zeiterfassung from "./zeiterfassung.vue";
import popUp from "~/components/frontEnd/lib/popUp";
import TableHeader from '~/components/frontEnd/lib/tableHeader';
import { mergeSchemas } from '~/assets/classes/objectClasses'
import confirmPopUp from "~/components/frontEnd/lib/confirmPopUp";
import selectYear from "~/components/frontEnd/selectYear";
import search from "~/components/frontEnd/search";
import dropDown from "~/components/frontEnd/dropDown"
import { mapGetters } from "vuex";

export default {
	components: {
		zeiterfassung,
		popUp,
		TableHeader,
		confirmPopUp,
		selectYear,
		search,
		dropDown
	},

	apollo: {
		pointsByUser: gql`
			query pointsByUser {
				pointsByUser {
					id
					data
				}
			}
		`,

		directory: gql `
			query directory{
				directory{
					id
					hierarchy
				} 
			}
		`
	},

	data () {
		return {
			kwListWithPoints: [],
			popUp: false,
			confirmPopUp: false,
			popUpSchema:{},
			clickedFile: {},
			userSummary: {
				weekhours: '0:00',
				hoursaldo: '2:10',
				holiday: 20,
				sickdays: 3
			},
			clickedFile:"",
			yearForZeiterfassung: "",
			searchValueForZeiterfassung: ""
		}
	},

	mounted () {
		this.sortPoints()
	},

	computed: {
		...mapGetters({
			userMeta: 'authentication/getUserMeta'
		}),
		getCurrentKW () {
			return this.KalenderWoche()
		},
		allWorkHoursPerWeek(){
			let temp = 0
			for(let day of this.userMeta.weeklyHours[0].distribution){
				temp += day
			} 
			return temp
		}
	},

	watch:{
		directory: {
			deep: true,
			handler () {
				this.$store.commit('directory/setDirectoryFromDatabase', this.directory)
			}
		},

		pointsByUser:{
			deep: true,
			handler(){
				this.sortPoints()
				this.$store.commit('point/setPointList', this.pointsByUser)
			}
		},
		yearForZeiterfassung(){
			this.sortPoints()
		}
	},

	methods: {
		captureMySearchValue(value){
			this.searchValueForZeiterfassung = value
		},
		captureMyYear (year) {
			this.yearForZeiterfassung = year;
		},
		getWeeklySummary (kwNumber, kw) {
			//console.log(52 - kwNumber, kw, this.getCurrentKW)
			let hours = 0
			let minutes = 0
			if (kw) {
				for (const item of kw) {
					const time = item.data.find(element => element.elementId === '83f4737a-0d63-407d-bdff-4ff576f97a13')
					hours += parseInt(time.data.text.split(':')[0])
					minutes += parseInt(time.data.text.split(':')[1])
				}
			}
			const test = (hours + Math.floor(minutes/60)).toString() + ':' + (minutes%60).toString()
			
			if ((52 - kwNumber) === this.getCurrentKW) {
				return {
					weekhours: test,
					hoursaldo: '0:00',
					holiday: '0',
					sickdays: '0'
				}
			} else {
				return {
					weekhours: test
				}
			}
		},

		//open the confirm popUp and send the clicked element to it
		getClickedItemForDelete(clickedFileValue){
			this.clickedFile = clickedFileValue
			this.confirmPopUp = true;
		},
		setConfirmPopUp(value){
			this.confirmPopUp = value
		},
		//if the answer from the confirm popUp is true, delete the clicked file
		deletePointFromList(value){
			if(value){
				this.$apollo.mutate({
					variables:{
						id: this.clickedFile.id
					},
					mutation: gql`
						mutation (
							$id: String
						) {
							deletePoint (
								id: $id
							)
						}
					`
				}).then(() => {
					this.$apollo.queries.pointsByUser.refetch()
					this.confirmPopUp = false;
				}).catch((error) => {
					console.log({ error })
				})
			}
			//closing the popUP
			this.confirmPopUp = false;
				
		},
		//open the edit time popUp with the merge method
		openEditTime(item){
			this.getDataForPopUp(["c519459a-5624-4311-bffb-838d43e7f0d0", "50dd57aa-b759-42e7-9bae-3830cd605f02"])
			this.popUp = true;
			this.clickedFile = item.id;
		},
		pointSaved(){
			this.popUp = false
			this.$apollo.queries.pointsByUser.refetch()
		},
		sortPoints () {
			this.kwListWithPoints = []
			let tempList = new Array(53)
			if (this.pointsByUser) {
				for (const point of this.pointsByUser) {
					const date = point.data.find(item => item.elementId === 'd43d0fd0-172d-4b7a-a942-990597d3cb42').data.text.split('.')
					if(date[2] !== this.yearForZeiterfassung){
						continue
					}
					const KWNumber = this.KalenderWoche(date[2], date[1], date[0])
					if (!tempList[KWNumber]) {
						tempList[KWNumber] = []
					}
					tempList[KWNumber].push(point)
					this.kwListWithPoints = tempList
				}
			}
		},

		KalenderWoche(j,m,t) {
			var Datum = new Date();
			if (!t) {
				j = Datum.getYear(); if (1900 > j) j +=1900;
				m = Datum.getMonth(); t = Datum.getDate();
			}
			else m--;
			Datum = new Date(j,m,t,0,0,1);
			var tag = Datum.getDay(); if (tag == 0) tag = 7;
			var d = new Date(2004,0,1).getTimezoneOffset();
			var Sommerzeit = (Date.UTC(j,m,t,0,d,1) - Number(Datum)) /3600000;
			Datum.setTime(Number(Datum) + Sommerzeit*3600000 - (tag-1)*86400000);
			var Jahr = Datum.getYear(); if (1900 > Jahr) Jahr +=1900;
			var kw = 1;
			if (new Date(Jahr,11,29) > Datum) {
				var Start = new Date(Jahr,0,1);
				Start = new Date(Number(Start) + 86400000*(8-Start.getDay()));
				if(Start.getDate() > 4) Start.setTime(Number(Start) - 604800000);
				kw = Math.ceil((Datum.getTime() - Start) /604800000);
			}
			return kw;
		},
		
		openNewProject(value){
			this.clickedFile = null;
			this.popUp = value;
			this.getDataForPopUp(["c519459a-5624-4311-bffb-838d43e7f0d0"]);
		},

		async getDataForPopUp(id){
			let schemas = [];
			// this.popUpSchema has to empty every time a new schema has to be loaded
			this.popUpSchema = null;
			//query the both schema
			for(const item of id){
				await this.$apollo.query({
					variables:{
						id: item
					},
					query: gql`
						query($id: String){
							querySchemaById( id: $id){
								id
								label
								metadata
								elements
							}
						}
					`
				}).then((data) => {
					//if both schemas are loaded, sending them to the mergeSchemas function to merge
					schemas.push(data.data.querySchemaById)
					if(id.length === schemas.length && id.length !== 1){
						this.popUpSchema = mergeSchemas(schemas[0], schemas[1]);
					}else if(id.length === 1){
						this.popUpSchema = data.data.querySchemaById;
					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.kw {
	margin-bottom: 30px;
}
.zeiterfassung {
	max-width: 900px
}
.top-section{
	margin-top: 30px;
	max-width: 900px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>