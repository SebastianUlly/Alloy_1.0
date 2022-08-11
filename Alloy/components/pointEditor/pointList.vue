<template>
	<div>
		<v-text-field
			v-model="time"
			label="Zeit"
			type="number"
		></v-text-field>
		<v-text-field
			v-model="date"
			label="Datum"
		></v-text-field>
		<v-data-table
			:headers="headers"
			:items="items"
			:items-per-page="5"
			class="elevation-1"
			:loading="loading"
    		loading-text="Loading... Please wait"
			:search="search"
		></v-data-table>
	</div>
</template>

<script>
import gql from 'graphql-tag'
export default {
	props: {
	},

	data () {
		return {
			items: [],
			loading: true,
			time: '',
			date: ''
		}
	},

	computed: {
      headers () {
        return [
			{
					text: 'Id',
					value: 'id',
					align: 'start'
				},
				{
					text: 'UserId',
					value: 'userId'
				},
				{
					text: 'Zeit',
					value: 'time',
					filter: value => {
						if (!this.time) return true

						return parseInt(value) < parseInt(this.time)
					},
				},
				{
					text: 'Datum',
					value: 'date',
					filter: value => {
						if (!this.date) return true

						return value === this.date
					},
				}
			]
		},
    },

	mounted () {
		this.startFunction()
	},

	methods: {
		startFunction () {
			this.$apollo.query({
				variables: {
					viewToSearch: "point_view",
					searchValue: "34839a13-63f2-4c75-8dbf-9d1e535ff6ad"
				},
				query: gql`
					query (
						$viewToSearch: String,
						$searchValue: String
					) {
						searchPoints (
							pointView: $viewToSearch
							searchValue: $searchValue
						) {
							id
							userId
							date
							time
						}
					}
				`
			}).then((data) => {
				console.log(data)
				this.items = data.data.searchPoints
				this.loading = false
			}).catch((error) => {
				console.log({ error })
			})
		}
	}
}
</script>