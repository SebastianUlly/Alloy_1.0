<template>
	<v-radio-group
		v-model="input"
		dense
		class="radio-tree"
		:mandatory="false"
		@change="changed"
	>
		<v-treeview
			:items="items"
			dense
			shaped
			hoverable
			:open-all="true"
			@update:open="opened"
		>
			<template
				v-slot:label="{ item }"
			>
				<v-radio
					:label="item.label"
					:value="valueFor(item)"
				/>
			</template>
		</v-treeview>
	</v-radio-group>
</template>
<script>
export default {
	props: {
		items: Array,
		valueKey: String,
		value: null // accept any type
	},
	data () {
		return {
			input: this.value[0],
			selected: null
		}
	},
	computed: {
		watchDefaultValue () {
			return this.value
		}
	},
	watch: {
		watchDefaultValue () {
			this.input = this.value[0]
		}
	},
	methods: {
		changed (value) {
			if (typeof value !== 'undefined' || !this.findInTree(this.selected)) {
				this.selected = this.valueFor(value)
				this.$emit('input', [this.selected])
			}
		},
		valueFor (value) {
			if (this.valueKey && value && typeof value === 'object' && value.hasOwnProperty(this.valueKey)) {
				value = value[this.valueKey]
			}
			return value
		},
		verifySelected () {
		// validate that the selected value is in the tree
		// (if parent component removes items, it should use a ref to call this function)
			if (this.selected && !this.findInTree(this.selected)) {
				this.selected = undefined
				this.$emit('input', [this.selected])
			}
		},
		findInTree (value, path = '*', key = null, items = null) {
			if (!key) {
				key = this.valueKey
			}
			if (!key) {
				key = 'id'
			}
			if (!items) {
				items = this.items
			}
			if (items && items.length) {
				if (typeof value === 'object') {
					value = value[key]
				}
				for (let i = 0; i < items.length; i++) {
					const item = items[i]
					if (!item) {
						continue
					}
					if (item[key] === value) {
						return item
					} else if (item.children && item.children.length) {
						let checkChildren = true
						if (Array.isArray(path)) {
							const pathIndex = path.findIndex(check => (check === item[key]))
							if (pathIndex !== -1) {
								path.splice(pathIndex, 1)
							} else {
								checkChildren = false
							}
						}
						if (checkChildren) {
							const foundInChild = this.findInTree(value, path, key, item.children)
							if (foundInChild) {
								return foundInChild
							}
						}
					}
				}
			}
			return null
		},
		opened (list) {
			if (!this.input && this.selected) {
				const selected = this.findInTree(this.selected, list)
				if (selected) {
					this.input = this.valueFor(selected)
				}
			}
		}
	}
}
</script>
<style>
.radio-tree {
  margin: 0;
}
.radio-tree.v-input--radio-group > .v-input__control {
  width: 100%;
}
.radio-tree.v-input--radio-group > .v-input__control > .v-input__slot {
  margin: 0;
}
.radio-tree.v-input--radio-group .v-treeview-node__label {
  overflow: visible;
}
</style>
