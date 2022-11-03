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
		getNamesToEntitiesInDirectory () {
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