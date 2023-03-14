<template>
	<div>
		<OptionsAndSearchBar
			v-if="paidHolidayList"
			@userId="captureUserId"
			@sendYear="captureMyYear"
			@sendValue="captureMySearchValue"
			@pointSaved="pointSaved"
			:paidHolidayList="paidHolidayList"
		/>
		<UserSummary
			v-if="summary"
			class="summary"
			:userInfo="{
				holidays: holidaysOfUser
			}"
			:weekly-summary="summary"
		/>
		<CalendarWeek
			v-if="selectedUserId && paidHolidayList"
			:selectedYear="selectedYear"
			:searchValue="searchValue"
			:selectedUserId="selectedUserId"
			@userId="getSummaryPointByUserId"
			:paidHolidayList="paidHolidayList"
			:weeklyWorkTimeOfUser="weeklyWorkTimeOfUser"
			:newPointSaved="savedPoint"
		/>
	</div>
</template>

<script>
import CalendarWeek from './KW.vue'
import UserSummary from './lib/Summary.vue'
import OptionsAndSearchBar from './lib/OptionsAndSearchBar.vue'
import { mapGetters } from "vuex";
import gql from "graphql-tag";

export default {
	components: {
		CalendarWeek,
		UserSummary,
		OptionsAndSearchBar
	},

	data () {
		return {
			summary: null,
			altSummary: null,
			selectedYear: '',
			searchValue: '',
			selectedUserId: '',
			paidHolidayList: [],
			selectedUser: null,
			savedPoint: false
		}
	},

	mounted () {
		this.selectedUserId = this.loggedInUserId
		this.getPaidHolidayList()
	},

	computed: {
		...mapGetters({
			loggedInUserId: 'authentication/getUserId',
			userMeta: 'authentication/getUserMeta'
		}),
		
		holidaysOfUser () {
			if (this.selectedUser) {
				return this.selectedUser.data.find(item => item.elementId === '65fcaacc-562f-44f8-bb72-b9bb71955fe9').data.text
			}
			return 0
		},

		weeklyWorkTimeOfUser () {
			if (this.selectedUser) {
				return this.selectedUser.data.find(item => item.elementId === '70ff9d2c-dc29-488d-8659-e4d35bd799ff').data.text[0].weeklyHours
			}
			return 0
		}
	},

	watch: {
		userMeta: {
			deep: true,
			handler () {
				this.getSummary()
			}
		},

		altSummary: {
			deep: true,
			handler () {
				this.getSummary()
			}
		},

		selectedUserId () {
			this.getDataToSelectedUser(this.selectedUserId)
			this.getSummaryPointByUserId(this.selectedUserId)
		}
	},

	methods: {
		pointSaved () {
			this.savedPoint = !this.savedPoint
		},

		getDataToSelectedUser (userId) {
			this.$apollo.query({
				variables: {
					userId: userId
				},
				query: gql`
					query (
						$userId: String
					) {
						getUserDataToUserId (
							userId: $userId
						) {
							userId
							data
						}
					}
				`
			}).then((data) => {
				this.selectedUser = data.data.getUserDataToUserId

			}).catch((error) => {
				console.log({ error })
			})
		},

		getPaidHolidayList () {
			this.$apollo.query({
				variables: {
					id: '6905fcdb-d575-4002-9fcd-35534aaa4c87'
				},
				query: gql`
					query (
						$id: String
					) {
						miscellaneousById (
							id: $id
						) {
							id
							label
							data
						}
					}
				`
			}).then((data) => {
				this.paidHolidayList = data.data.miscellaneousById.data
			}).catch((error) => {
				console.log({ error })
			})
		},

		getSummary () {
			if (this.altSummary) {
				this.summary = {
					hoursaldo: this.altSummary.find(item => item.elementId === 'f6aede6f-2d0e-497a-bfc2-02596e46048a').data.text,
					holiday: this.altSummary.find(item => item.elementId === '19041546-0910-451a-929c-c41f059261f6').data.text,
					sickdays: this.altSummary.find(item => item.elementId === '7302e88a-66b3-4283-908e-7933813602de').data.text
				}
			} else {
				this.summary = {
					hoursaldo: this.userMeta.summary.find(item => item.elementId === 'f6aede6f-2d0e-497a-bfc2-02596e46048a').data.text,
					holiday: this.userMeta.summary.find(item => item.elementId === '19041546-0910-451a-929c-c41f059261f6').data.text,
					sickdays: this.userMeta.summary.find(item => item.elementId === '7302e88a-66b3-4283-908e-7933813602de').data.text
				}
			}
		},

		getSummaryPointByUserId (userIdToGet) {
			this.$apollo.query({
				variables: {
					userId: userIdToGet
				},
				query: gql`
					query (
						$userId: String!
					) {
						getSummaryToUserId (
							userId: $userId
						) {
							id
							data
						}
					}
				`
			}).then((data) => {
				this.altSummary = data.data.getSummaryToUserId.data
			}).catch((error) => {
				console.log({ error })
			})
		},

		captureUserId (data) {
			this.selectedUserId = data
		},

		captureMyYear (data) {
			this.selectedYear = data
		},

		captureMySearchValue (data) {
			this.searchValue = data
		}
	}
}
</script>

<style lang="scss" scoped>
.summary {
	position: fixed;
	right: 20px;
	top: 150px;
}
</style>