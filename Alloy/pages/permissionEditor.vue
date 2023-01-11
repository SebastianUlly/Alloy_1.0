<template>
	<!-- <div>
		<h1>Permission Editor</h1>
		<PermissionDirectory />
	</div> -->
</template>
<script>
import PermissionDirectory from '~/components/permissionEditor/permissionDirectory.vue'
export default {
	created(){
		this.$router.push("/")
	}
	/* components: {
		PermissionDirectory
	},

	data(){
		return{
			items:[],
			selection: [],
		}
	} */
};
</script>
<style>

</style>