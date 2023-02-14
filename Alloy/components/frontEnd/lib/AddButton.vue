<template>
	<!-- the button sets the popUp variable true and the popUp window will appear -->
	<v-btn
		v-show="checkPermissionIdsHere('a9c5c480-c9d9-4564-9e21-3c78c493f203')"
		style="min-width:0"
		class="addProject"
		color="green"
		@click="openNewProject(true)"
	>
		<!-- the icon with the file and + -->
		<v-icon>
			mdi-note-plus-outline
		</v-icon>
	</v-btn>
</template>

<script>
import { checkPermissionId } from '~/assets/functions/permission'
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters({
			permissionIds: 'authentication/getPermissionIds'
		}),

		//checks if the permissionId is in the permissionIds list and sends the permissionId to the checkPermissionId function
		checkPermissionIdsHere (arg) {
			if (this.permissionIds) {
				return checkPermissionId(this.permissionIds, arg)
			}
			return false
		}
	},

	methods: {
		//set the boolean variable true and the popUp opens
		openNewProject(value){
			this.$store.commit("file/resetEnteredData")
			// this.clickedFile = null;
			// this.popUp = value;
			// this.getDataForPopUp(["ca78b111-d1f0-4b4b-b82c-c7e727804b0b"]);
			this.$emit('openPopUp')
		},
	}
}
</script>