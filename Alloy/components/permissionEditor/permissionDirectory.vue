<template>
	<div>
		<v-treeview
			:items="items"
		>
		</v-treeview>
	</div>
</template>

<script>
import gql from 'graphql-tag'
import { NestedDirectory } from '~/assets/directoryClasses'
export default {
	apollo: {
		//querying the permission descriptions, id and hierarchy
		getPermissionDirectory: gql`
            query {
                getPermissionDirectory{
                    id
                    hierarchy
                }
            }
        `,
		permissionFiles: gql`
            query {
                permissionFiles {
                    permissionId
                    description
                }
            }
        `
	},
	data () {
		return {
			items: []
		}
	},

	mounted () {
		this.getNamesToEntitiesInDirectory()
	},

	watch: {
		getPermissionDirectory: {
			deep: true,
			handler () {
				this.getNamesToEntitiesInDirectory()
			}
		},

		permissionFiles: {
			deep: true,
			handler () {
				this.getNamesToEntitiesInDirectory()
			}
		}
	},

	methods: {
		//creating the array for the TreeView component
		getNamesToEntitiesInDirectory () {
			//if both query exists call create the NestedDirectory
			if (this.getPermissionDirectory && this.permissionFiles) {
				for (const entity of this.getPermissionDirectory[0].hierarchy) {
					entity.name = this.permissionFiles.find(item => item.permissionId === entity.permissionId).description
				}
				const directory = new NestedDirectory(this.getPermissionDirectory[0].hierarchy)
				this.items = directory.unflattenTree(directory.directoryCopy)
			}
		}
	}
}
</script>