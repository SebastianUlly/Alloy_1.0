<template>
	<div class="options-and-search-bar">
		<OpenPopUp
			:popUpSchemaIds="['c519459a-5624-4311-bffb-838d43e7f0d0']"
			:paidHolidayList="paidHolidayList"
			:selectedUserId="selectedUserId"
			@pointSaved="$emit('pointSaved')"
		/>
		<div class= "searchContainer">
			<selectUser
				v-if="checkPermissionIdsHere('b57d9dd1-646c-47dc-90d8-eef85a2cad1f')"
				@userId="changeUser"
			/>
			<selectYear @sendYear="captureMyYear" class="selectYearComponent"/>
			<search @sendValue="captureMySearchValue" />
		</div>
	</div>
</template>

<script>
import selectYear from "~/components/frontEnd/selectYear";
import selectUser from "~/components/frontEnd/selectUser";
import search from "~/components/frontEnd/search";
import { mapGetters } from "vuex"
import { checkPermissionId } from '~/assets/functions/permission'
import OpenPopUp from "./OpenPopUp.vue";

export default {
	props: {
		paidHolidayList: {
			type: Array,
			required: false
		}
	},

	components: {
		selectYear,
		search,
		selectUser,
		OpenPopUp
	},

	data () {
		return {
			selectedUserId: ''
		}
	},

	computed: {
		...mapGetters({
			permissions: 'authentication/getPermissionIds'
		})		
	},

	methods: {
		// function to check the permissions in this component
		checkPermissionIdsHere (arg) {
			if (this.permissions) {
				return checkPermissionId(this.permissions, arg)
			}
			return false
		},

		changeUser (data) {
			this.$emit('userId', data)
			this.selectedUserId = data
		},

		captureMyYear (data) {
			this.$emit('sendYear', data)
		},

		captureMySearchValue (data) {
			this.$emit('sendValue', data)
		}
	},
}
</script>

<style lang="scss" scoped>
.options-and-search-bar {
	display: flex;
}
.searchContainer{
	margin: 24px 0 0 70px;
	display:flex;
}
</style>