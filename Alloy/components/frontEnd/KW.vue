<template>
	<div>
		<div class="top-section">
			<v-btn
				style="min-width:0"
				class="addProject"
				color="green"
				:disabled="popUp"
				:loading="popUpLoading"
				@click="openNewProject(true)"
			>
				<v-icon>
					mdi-timer-plus-outline
				</v-icon>
			</v-btn>
			<!-- <dropDown/> -->
			<div class= "searchContainer">
				<selectUser
					v-if="checkPermissionIdsHere('b57d9dd1-646c-47dc-90d8-eef85a2cad1f')"
					@userId="changeUser"
				/>
				<selectYear @sendYear="captureMyYear" class="selectYearComponent"/>
				<search @sendValue="captureMySearchValue" />
			</div>
		</div>
		<popUp
			v-if="popUp && popUpSchema"
			@closeNewProject="openNewProject($event)"
			:popUpSchema="popUpSchema"
			:clickedFile="clickedFile"
			@saveSuccess="pointSaved"
			:selectedUserId="selectedUserId"
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
				v-if="(52 - index) === getCurrentKW && selectedUserId === loggedInUserId"
				:headline="(52 - index).toString() + '. KW'"
				:user-info="{
					workhours: allWorkHoursPerWeek,
					holiday: userMeta.holidays
				}"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'sign'"
				class="tableHeader"
				@releaseKW="releaseKW(kw)"
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
import selectUser from "~/components/frontEnd/selectUser";
import search from "~/components/frontEnd/search";
import dropDown from "~/components/frontEnd/dropDown"
import { mapGetters } from "vuex";
import { checkPermissionId } from '~/assets/functions/permission'

export default {
	components: {
		zeiterfassung,
		popUp,
		TableHeader,
		confirmPopUp,
		selectYear,
		search,
		dropDown,
		selectUser
	},

	apollo: {
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
				weekhours: 'loggedInUserId0:00',
				hoursaldo: '2:10',
				holiday: 20,
				sickdays: 3
			},
			clickedFile:"",
			yearForZeiterfassung: "",
			searchValueForZeiterfassung: "",
			popUpLoading: false,
			pointsByUserId: [],
			selectedUserId: ''
		}
	},

	mounted () {
		/* if(!this.selectedUserId){
			this.selectedUserId = this.loggedInUserId
		}
		this.sortPoints() */
		this.changeUser(this.loggedInUserId)
	},

	computed: {
		...mapGetters({
			loggedInUserId: 'authentication/getUserId',
			userMeta: 'authentication/getUserMeta',
			permissions: 'authentication/getPermissionIds'
		}),
		getCurrentKW () {
			return this.KalenderWoche()
		},

		// returning the total workhours per week a user should be working
		allWorkHoursPerWeek(){
			let temp = 0
			// looping through the distribution and adding all the values to get the sum
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

		pointsByUserId:{
			deep: true,
			handler(){
				this.sortPoints()
				this.$store.commit('point/setPointList', this.pointsByUserId)
			}
		},
		yearForZeiterfassung(){
			this.sortPoints()
		}
	},

	methods: {
		releaseKW (kw) {
			console.log(kw)
			const pointsToRelease = []
			for (const item of kw) {
				pointsToRelease.push(item.id)
			}

			this.$apollo.mutate({
				variables: {
					pointIds: pointsToRelease
				},
				mutation: gql`
					mutation (
						$pointIds: [String]
					) { 
						releasePoints (
							pointIds: $pointIds
						)
					}
				`
			}).then((data) => {
				console.log(data)
			}).catch((error) => {
				console.log({ error })
			})
		},

		// function that is called when a different user is selected in the selectUser-component
		changeUser (data) {
			
			this.selectedUserId = data
			this.$apollo.query({
				variables: {
					userId: data
				},
				query: gql`
					query (
						$userId: String
					) {
						pointsByUserId (
							userId: $userId
						) {
							id
							data
						}
					}
				`
			}).then((data) => {
				this.pointsByUserId = data.data.pointsByUserId
			}).catch((error) => {
				console.log({ error })
			})
		},

		// function to check the permissions in this component
		checkPermissionIdsHere (arg) {
			if (this.permissions) {
				return checkPermissionId(this.permissions, arg)
			}
			return false
		},
		
		captureMySearchValue(value){
			this.searchValueForZeiterfassung = value
		},
		captureMyYear (year) {
			this.yearForZeiterfassung = year;
		},

		// getting the weekly summary
		getWeeklySummary (kwNumber, kw) {
			// first need to calculate the time worked per week
			// starting with 0 hours and minutes
			let hours = 0
			let minutes = 0
			// checking if a kw is given
			if (kw) {
				// looping through every entry in the kw
				for (const item of kw) {
					// getting the time of the entry
					const time = item.data.find(element => element.elementId === '83f4737a-0d63-407d-bdff-4ff576f97a13')
					// getting the sum of all the hours hours
					hours += parseInt(time.data.text.split(':')[0])
					// and the minutes
					minutes += parseInt(time.data.text.split(':')[1])
				}
			}
			// adding the hoiurs coming from the minutes which have reached the 60 miniute mark and combining it with minutes left over into a String
			const test = (hours + Math.floor(minutes/60)).toString() + ':' + (minutes%60).toString()
			// returning the summary
			if ((52 - kwNumber) === this.getCurrentKW) {
				return {
					weekhours: test,
					hoursaldo: this.userMeta.summary.find(item => item.elementId === 'f6aede6f-2d0e-497a-bfc2-02596e46048a').data.text,
					holiday: this.userMeta.summary.find(item => item.elementId === '19041546-0910-451a-929c-c41f059261f6').data.text,
					sickdays: this.userMeta.summary.find(item => item.elementId === '7302e88a-66b3-4283-908e-7933813602de').data.text
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
					this.$apollo.queries.pointsByUserId.refetch()
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
			this.$apollo.queries.pointsByUserId.refetch()
		},
		sortPoints () {
			this.kwListWithPoints = []
			let tempList = new Array(53)
			if (this.pointsByUserId) {
				for (const point of this.pointsByUserId) {
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
			this.popUpLoading = true
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
			this.popUpLoading = false
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
.searchContainer{
	display:flex;
}
.top-section{
	margin-top: 30px;
	max-width: 900px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>