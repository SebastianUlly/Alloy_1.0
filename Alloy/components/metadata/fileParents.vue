<template>
	<div>
		<h3>
			File-Parents
		</h3>
		<v-list dense>
			<v-list-item-group>
				<v-list-item
					v-for="item of arrayOfParents"
					:key="item.id"
				>
					<v-list-item-icon>
						<v-icon>
							mdi-folder
						</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title v-text="item.label" />
					</v-list-item-content>
					<v-list-item-icon>
						<v-icon
							@click="removeParent(item)"
						>
							mdi-delete
						</v-icon>
					</v-list-item-icon>
				</v-list-item>
			</v-list-item-group>
		</v-list>
		<!-- treeview for leaves -->
		<div v-if="schemaValues.isLeaf">
			<v-treeview
				dense
				:items="directoryForParentSelection"
				:open-all="true"
			>
				<template v-slot:prepend="{ item }">
					<v-icon
						v-if="!item.checked"
						@click="addParent(item)"
					>
						mdi-checkbox-blank-outline
					</v-icon>
					<v-icon
						v-else
						color="blue"
						@click="removeParent(item)"
					>
						mdi-checkbox-marked
					</v-icon>
				</template>
				<template v-slot:label="{ item }">
					<div v-if="item.label" class="entity_label">
						{{ item.label }}
					</div>
				</template>
			</v-treeview>
		</div>
		<!-- treeview for branches -->
		<div v-else>
			<radio-tree
				v-model="arrayOfParentIds"
				:items="directoryForParentSelection"
				value-key="id"
				:value="arrayOfParentIds[0]"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import RadioTree from '~/components/radioTree'
import { DirectoryWithoutLeaves } from '~/assets/directoryClasses'

export default {
	components: {
		RadioTree
	},
	props: {
		elementId: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		}
	},

	data () {
		return {
			arrayOfParentIds: [],
			directoryForParentSelection: [],
			arrayOfParents: []
		}
	},

	computed: {
		...mapGetters({
			storeDirectory: 'directory/getDirectory',
			fileValues: 'file/getFileValues',
			schemaValues: 'schema/getSchemaValues'
		}),

		watchFileValues () {
			return this.fileValues
		},

		watchArrayOfParentIds () {
			return this.arrayOfParentIds
		}
	},

	watch: {
		watchFileValues: {
			deep: true,
			handler () {
				this.arrayOfParentIds = JSON.parse(JSON.stringify(this.fileValues.parentIds))
				this.directoryForSelection()
			}
		},

		watchArrayOfParentIds: {
			deep: true,
			handler () {
				this.directoryForSelection()
				this.findParentsToParentIds()
				this.$store.commit('file/setParentIdsToEnteredValues', this.arrayOfParentIds)
			}
		}
	},

	mounted () {
		this.directoryForSelection()
	},

	methods: {
		findParentsToParentIds () {
			this.arrayOfParents = []
			for (const parentId of this.arrayOfParentIds) {
				const parent = this.storeDirectory.find(item => item.id === parentId)
				if (parent) {
					this.arrayOfParents.push(parent)
				}
			}
		},

		directoryForSelection () {
			const leavelessDirectory = new DirectoryWithoutLeaves(this.storeDirectory)
			// if a folder is clicked it will be removed from the leavless directory (can't put a folder inside itself)
			const directoryWithRemovedEntities = leavelessDirectory.removeEntityByFileId(this.fileValues.id)
			for (const parent of directoryWithRemovedEntities) {
				if (this.arrayOfParentIds.includes(parent.id)) {
					parent.checked = true
				}
			}
			// unflatten the array to make a nested tree
			this.directoryForParentSelection = leavelessDirectory.unflattenLeavelessTree(directoryWithRemovedEntities)
		},

		// function to add a parent
		addParent (parent) {
			// pushing the parentId into arrayOfParentIds
			this.arrayOfParentIds.push(parent.id)
		},

		// function to remove a parent
		removeParent (parent) {
			// finding all the parentIds not equal to the parent which is to be removed and storing them ini a new array
			const arrayOfParentIdsWithRemovedParent = this.arrayOfParentIds.filter(item => item !== parent.id)
			// overwriting arrayOfParentIds with the new array
			this.arrayOfParentIds = arrayOfParentIdsWithRemovedParent
		}
	}
}
</script>
