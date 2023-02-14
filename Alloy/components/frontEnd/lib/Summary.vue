<template>
	<v-card class="summary-container">
		<p v-if="weeklySummary.hoursaldo">
			<span>
				Stundensaldo:
			</span>
			<span
				v-if="weeklySummary.hoursaldo[0] !== '-'"
			>
				{{ weeklySummary.hoursaldo }}
			</span>
			<span :style="'color: red'"
				v-else
			>
				{{ weeklySummary.hoursaldo }}
			</span>
			<v-icon class="icon">
				mdi-clock-outline
			</v-icon>
		</p>
		<p v-if="weeklySummary.holiday">
			<span>
				Urlaub:
			</span>
			<span>
				{{ weeklySummary.holiday }}
			</span>
			<span>
				({{ userInfo.holidays }})
			</span>
			<v-icon class="icon">
				mdi-calendar-blank
			</v-icon>
		</p>
		<p v-if="weeklySummary.sickdays">
			<span>
				Krankentage:
			</span>
			<span>
				{{ weeklySummary.sickdays }}
			</span>
		</p>
	</v-card>
</template>

<script>
export default {
	props: {
		userInfo: {
			type: Object
		},

		weeklySummary: {
			type: Object
		}
	}
}
</script>

<style scoped>
.summary-container {
	width: 250px;
	height: 150px;
	padding: 20px;
}
</style>