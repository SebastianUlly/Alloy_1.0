<template>
	<div>
		<popUp
			v-if="popUp && popUpSchema"
			@closeNewProject="popUp = false"
			:popUpSchema="popUpSchema"
			:clickedFile="clickedFile"
			@saveSuccess="pointSaved"
			:selectedUserId="selectedUserId"
			:paid-holidays="paidHolidayList"
		/>
		<confirmPopUp
			v-if="confirmPopUp"
			:clickedFile="clickedFile"
			:confirmPopUpData="confirmPopUpData"
			@closePopUp="setConfirmPopUp"
			@sendAnswer="getAnswerFromConfirmPopUp"
		/>
		<div
			v-for="(kw, index) of kwListWithPoints.slice().reverse()"
			:key="index"
			class="kw"
		>

			<TableHeader
				v-if="(52 - index) === getCurrentKW && !arePointsReleased(kw) && selectedUserId === loggedInUserId"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'release'"
				:showButton="!arePointsReleased(kw)"
				:stateOfPoints="'needToBeReleased'"
				class="tableHeader"
				@releaseKW="setConfirmPopUpData(kw, 'release', 'Kalenderwoche freigeben')"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>

			<TableHeader
				v-else-if="kw && !arePointsReleased(kw) && selectedUserId === loggedInUserId"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'release'"
				:stateOfPoints="'needToBeReleased'"
				:showButton="!arePointsReleased(kw)"
				class="tableHeader"
				@releaseKW="setConfirmPopUpData(kw, 'release', 'Kalenderwoche freigeben')"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>
			
			<TableHeader
				v-else-if="(52 - index) === getCurrentKW && arePointsReleased(kw) && !arePointsSigned(kw) && checkPermissionIdsHere('975abc9d-878b-4eb1-999e-3890991217f8')"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'sign'"
				:stateOfPoints="'needToBeSigned'"
				:showButton="!arePointsSigned(kw)"
				class="tableHeader"
				@signTheKW="setConfirmPopUpData( kw ,'sign', 'Kalenderwoche signieren')"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>

			<TableHeader
				v-else-if="kw && arePointsReleased(kw) && !arePointsSigned(kw) && checkPermissionIdsHere('975abc9d-878b-4eb1-999e-3890991217f8')"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'sign'"
				:stateOfPoints="'needToBeSigned'"
				:showButton="!arePointsSigned(kw)"
				class="tableHeader"
				@signTheKW="setConfirmPopUpData( kw, 'sign', 'Kalenderwoche signieren')"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>
				
			<TableHeader
				v-else-if="(52 - index) === getCurrentKW && !arePointsReleased(kw) && selectedUserId !== loggedInUserId"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'none'"
				:showButton="false"
				:stateOfPoints="'needToBeReleased'"
				class="tableHeader"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>

			<TableHeader
				v-else-if="kw && !arePointsReleased(kw) && selectedUserId !== loggedInUserId"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'none'"
				:showButton="false"
				:stateOfPoints="'needToBeReleased'"
				class="tableHeader"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>

			<TableHeader
				v-else-if="kw && arePointsReleased(kw)"
				:headline="(52 - index).toString() + '. KW'"
				:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
				:weekly-summary="getWeeklySummary(index, kw)"
				:button="'none'"
				:showButton="false"
				:stateOfPoints="'signed'"
				class="tableHeader"
				@refreshKW="refreshKW()"
				@reset="resetKW(kw)"
			/>

			<zeiterfassung
				v-if="kw"
				:points="kw"
				:year="selectedYear"
				:searchValue="searchValue"
				@getClickedItem="openEditTime"
				@setConfirmPopUpData="setConfirmPopUpData"
				class="zeiterfassung"
				:showActions="!arePointsSigned(kw)"
				:paid-holidays="kwListWithHolidays[52 - index]"
				:refreshKWList="refreshKWList"
			/>
		</div>
	</div>
</template>

<script>
import zeiterfassung from "./zeiterfassung.vue";
import popUp from "~/components/frontEnd/lib/popUp";
import TableHeader from '~/components/frontEnd/lib/tableHeader';
import { mergeSchemas } from '~/assets/classes/objectClasses'
import confirmPopUp from "~/components/frontEnd/lib/confirmPopUp";
import dropDown from "~/components/frontEnd/dropDown"
import { mapGetters } from "vuex";
import { checkPermissionId } from '~/assets/functions/permission'
import gql from "graphql-tag";

export default {
	props: {
		searchValue: {
			type: String,
			required: false
		},
		
		selectedYear: {
			type: String,
			required: false
		},

		selectedUserId: {
			type: String,
			required: true
		},
		
		paidHolidayList: {
			type: Array,
			required: false
		},

		weeklyWorkTimeOfUser: {
			type: Number,
			required: false
		},

		newPointSaved: {
			type: Boolean,
			required: false
		}
	},

	components: {
		zeiterfassung,
		popUp,
		TableHeader,
		confirmPopUp,
		dropDown
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
			confirmPopUpData: {},
			popUpSchema:{},
			userSummary: {
				weekhours: '0:00'
			},
			clickedFile: null,
			popUpLoading: false,
			pointsByUserId: [],
			kwListWithHolidays: [],
			updatePointsLoading: false,
			refreshKWList: []
		}
	},

	mounted () {
		this.getPoints(this.selectedUserId)
	},

	computed: {
		...mapGetters({
			loggedInUserId: 'authentication/getUserId',
			userMeta: 'authentication/getUserMeta',
			permissions: 'authentication/getPermissionIds'
		}),

		getCurrentKW () {
			return this.KalenderWoche()
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

		selectedYear(){
			this.sortPoints()
		},

		paidHolidayList: {
			deep: true,
			handler () {
				this.sortPaidHolidays()
			}
		},

		selectedUserId () {
			this.getPoints(this.selectedUserId)
			this.$emit('userId', this.selectedUserId)
		},

		newPointSaved () {
			this.getPoints(this.selectedUserId)
		}
	},

	methods: {
		resetKW (kw) {
			const pointsToReset = []
			for (const item of kw) {
				pointsToReset.push(item.id)
			}

			this.$apollo.mutate({
				variables: {
					pointIds: pointsToReset
				},
				mutation: gql`
					mutation (
						$pointIds: [String]
					) { 
						resetPoints (
							pointIds: $pointIds
						)
					}
				`
			}).then((data) => {
				this.getPoints(this.loggedInUserId)
				this.confirmPopUp = false
			}).catch((error) => {
				console.log({ error })
			})
		},

		refreshKW(){
			this.getPoints(this.selectedUserId)
		},

		// returning the total workhours per week a user should be working
		allWorkHoursPerWeek(index){
			if (index){
				let timeToWorkInAFullWeek = 0
				// looping through the distribution and adding all the values to get the sum
				for(let day of this.userMeta.weeklyHours[0].distribution){
					timeToWorkInAFullWeek += day
				}
	
				let timeDeductetFromTotalTimeToWorkDueToPaidHolidays = 0
				if (this.kwListWithHolidays[52 - index]) {
					for (const item of this.kwListWithHolidays[52 - index]) {
						timeDeductetFromTotalTimeToWorkDueToPaidHolidays += this.userMeta.weeklyHours[0].distribution[0]
					}
				}
	
				return timeToWorkInAFullWeek - timeDeductetFromTotalTimeToWorkDueToPaidHolidays
			}
			return 0
		},

		sortPaidHolidays () {
			this.kwListWithHolidays = []
			let tempList = new Array(53)
			if (this.paidHolidayList) {
				for (const holiday of this.paidHolidayList) {
					const date = holiday.date.split('.')
					if(date[2] !== this.selectedYear){
						continue
					}
					const KWNumber = this.KalenderWoche(date[2], date[1], date[0])
					if (!tempList[KWNumber]) {
						tempList[KWNumber] = []
					}
					tempList[KWNumber].push(holiday)
				}
				this.kwListWithHolidays = tempList
			}
		},

		arePointsReleased (kw) {
			if (kw) {
				return kw.every(
					(point) => {
						return point.data.find(item => item.elementId === 'ccf2057a-d5f7-4786-bb35-cc24ad152436')?.data.text === this.selectedUserId
					}
				)
			}
			return false
		},

		arePointsSigned (kw) {
			if (kw) {
				return kw.every(
					(point) => {
						if (point.data.find(item => item.elementId === '86762034-4941-4bd1-b371-d5316c1838c6')) {
							return point.data.find(item => item.elementId === '86762034-4941-4bd1-b371-d5316c1838c6')?.data.text !== ''
						} else {
							return point.data.find(item => item.elementId === '86762034-4941-4bd1-b371-d5316c1838c6')
						}
					}
				)
			}
			return false
		},

		releaseKW (kw) {
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
				this.getPoints(this.loggedInUserId)
				this.confirmPopUp = false
			}).catch((error) => {
				console.log({ error })
			})
		},

		signKW (kw) {
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
						signPoints (
							pointIds: $pointIds
						)
					}
				`
			}).then((data) => {
				this.getPoints(this.selectedUserId)
				this.confirmPopUp = false;
			}).catch((error) => {
				console.log({ error })
			})
		},

		getPoints (userId) {
			// console.log('getPoints', userId)
			this.updatePointsLoading = true;
			this.$apollo.query({
				variables: {
					userId: userId
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

			let hoursWorkedSummary = (hours + Math.floor(minutes/60)).toString()
			if (hoursWorkedSummary.length === 1) {
				hoursWorkedSummary = '0' + hoursWorkedSummary
			}
			let minutesWorkedSummary = (minutes%60).toString()
			if (minutesWorkedSummary.length === 1) {
				minutesWorkedSummary = '0' + minutesWorkedSummary
			}
			// adding the hoiurs coming from the minutes which have reached the 60 miniute mark and combining it with minutes left over into a String
			const hoursWorked = hoursWorkedSummary + ':' + minutesWorkedSummary

			let releaseOrSignObj = {
				isLoggedInUser: true,
				released: '',
				signed: ''
			}

			if (this.selectedUserId !== this.loggedInUserId) {
				releaseOrSignObj.isLoggedInUser = false
			}
			if (kw) {
				let signed = false
				let released = false
				for (const point of kw) {
					if (point.data.find(item => item.elementId === '29f73e9d-d87c-49c4-a2f9-57fd27cfaa77')) {
						released = true
					} else {
						released = false
						break
					}
				}
				for (const point of kw) {
					if (point.data.find(item => item.elementId === 'f825155a-51a3-4904-a32c-1fe7f0cc78e4')) {
						signed = true
					} else {
						signed = false
						break
					}
				}
				if (signed) {
					releaseOrSignObj.signed = kw[0].data.find(item => item.elementId === 'f825155a-51a3-4904-a32c-1fe7f0cc78e4').data.text
				} else if (released) {
					releaseOrSignObj.released = kw[0].data.find(item => item.elementId === '29f73e9d-d87c-49c4-a2f9-57fd27cfaa77').data.text
				}
				// console.log(releaseOrSignObj)
			}
			// returning the summary
			if ((52 - kwNumber) === this.getCurrentKW) {
				return {
					weekhours: hoursWorked,
					hoursaldo: this.userMeta.summary.find(item => item.elementId === 'f6aede6f-2d0e-497a-bfc2-02596e46048a').data.text,
					holiday: this.userMeta.summary.find(item => item.elementId === '19041546-0910-451a-929c-c41f059261f6').data.text,
					sickdays: this.userMeta.summary.find(item => item.elementId === '7302e88a-66b3-4283-908e-7933813602de').data.text,
					releaseOrSignObj: releaseOrSignObj
				}
			} else {
				return {
					weekhours: hoursWorked,
					releaseOrSignObj: releaseOrSignObj
				}
			}
		},

		//open the confirm popUp and send the clicked element to it
		//"configuring" the popup with label icon and giving them a type
		setConfirmPopUpData(item, type, label){
			//clear the clickedFile
			this.clickedFile = null
			//if we click the delete button than it will forward the data to the popup, we want to delete
			//so if item.Beschreibung exists just than forward the data
			if(item.Beschreibung){
				this.clickedFile = item;
			}
			//the type is needed to distinguish the content we want to display
			this.confirmPopUpData.type = type;
			this.confirmPopUpData.label = label;
			if(type == 'sign'){
				this.confirmPopUpData.icon = 'mdi-lock-outline'
				this.confirmPopUpData.kw = item
			}else if(type == 'release'){
				this.confirmPopUpData.icon = 'mdi-lock-open-outline'
				this.confirmPopUpData.kw = item
				this.confirmPopUpData.label = 'Kalenderwoche freigeben'
			}
			else if(type == 'delete'){
				this.confirmPopUpData.icon = 'mdi-delete-outline'
			}
			else {
				this.confirmPopUpData.kw = null
			}

			this.confirmPopUp = true;
		},
		//closing the confirmPopUp
		setConfirmPopUp(value){
			this.confirmPopUp = value
		},
		//here we get the answer emit from the confirmPopUp
		getAnswerFromConfirmPopUp(value, type, kw){
			//switching between the function to run
			if(type == 'delete'){
				this.deletePointFromList(value, type)
			}
			if(type == 'sign' && value){
				this.signKW(kw)
			}
			if(value == false){
				this.confirmPopUp = false;
			}
			if(type == 'release' && value){
				this.releaseKW(kw)
			}
		},
		//if the answer from the confirm popUp is true, delete the clicked file
		deletePointFromList(value, type){
			if(value && type == 'delete'){
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
					this.getPoints(this.selectedUserId)
					this.confirmPopUp = false;
				}).catch((error) => {
					console.log({ error })
				})
				//closing the popUP
				this.confirmPopUp = false;
			}else if(value == false && type == 'delete'){
				this.confirmPopUp = false;
			}
				
		},
		//open the edit time popUp with the merge method
		openEditTime(item){
			this.getDataForPopUp(["c519459a-5624-4311-bffb-838d43e7f0d0", "50dd57aa-b759-42e7-9bae-3830cd605f02"])
			this.popUp = true;
			this.clickedFile = item.id;
		},
		pointSaved(){
			this.popUp = false
			this.getPoints(this.selectedUserId)
		},
		sortPoints () {
			this.kwListWithPoints = []
			let tempList = new Array(53)
			if (this.pointsByUserId) {
				for (const point of this.pointsByUserId) {
					const date = point.data.find(item => item.elementId === 'd43d0fd0-172d-4b7a-a942-990597d3cb42').data.text.split('.')
					if(date[2] !== this.selectedYear){
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
			// console.log(this.kwListWithPoints)
			this.updatePointsLoading = false
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
</style>