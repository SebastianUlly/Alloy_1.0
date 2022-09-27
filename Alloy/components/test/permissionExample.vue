<template>
	<div>
		<div style="display: flex;">
			<div
				id="one"
				v-if="$store.getters['authentication/checkPermissionId']('2512150a-a016-4269-9715-b00044666fcd')"
			>
			<h3>
				files
			</h3>
			
				<vue-json-pretty :data="files" />
			</div>
			<div
				id="one"
				v-if="$store.getters['authentication/checkPermissionId']('3135340a-e40f-498b-830c-9e021cad863f')"
			>
			<h3>
				schema
			</h3>
				<vue-json-pretty :data="schema" />
			</div>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag'

export default {
	data () {
		return {
			files: [],
			schema: []
		}
	},

	mounted () {
		this.test()
		this.test2()
	},

	methods: {
		test () {
			this.$apollo.query({
				variables: {
					permissionId: '2512150a-a016-4269-9715-b00044666fcd'
				},
				query: gql`
					query (
						$permissionId: String
					) {
						auth_test (
							permissionId: $permissionId
						) {
							label
						}
					}
				`
			}).then((data) => {
				this.files = data.data.auth_test
			}).catch((error) => {
				console.log({ error })
			})
		},

		test2 () {
			this.$apollo.query({
				variables: {
					permissionId: '3135340a-e40f-498b-830c-9e021cad863f'
				},
				query: gql`
					query (
						$permissionId: String
					) {
						auth_test2 (
							permissionId: $permissionId
						) {
							label
						}
					}
				`
			}).then((data) => {
			console.log(data)
				this.schema = data.data.auth_test2
			}).catch((error) => {
				console.log({ error })
			})
		}
	}
}
</script>