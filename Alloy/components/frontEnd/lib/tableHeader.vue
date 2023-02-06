<template>
	<div class="header">
		<div class="text">
			<h1>
				{{ headline }}
			</h1>
			<p>
				<span>
					Wochenstunden:
				</span>
				<span>
					{{ weeklySummary.weekhours }}
				</span>
				<span>
					({{ userInfo.workhours }})
				</span>
			</p>
			<p v-if="weeklySummary.hoursaldo">
				<span>
					Stundensaldo:
				</span>
				<span :style="'color: green'"
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
				<span :style="'color: green'">
					+{{ weeklySummary.holiday }}
				</span>
				<span>
					({{ userInfo.holiday }})
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
		</div>
		<v-btn
			v-if="button === 'release' && showButton"
			class="button"
			color="green"
			@click="$emit('releaseKW')"
		>
			Freigeben
		</v-btn>
		<v-btn
			v-if="button === 'sign' && showButton"
			class="button"
			color="green"
			@click="$emit('signTheKW')"
		>
			Signieren
		</v-btn>
	</div>
</template>

<script>
export default {
	props: {
		headline: {
			type: String
		},

		userInfo: {
			type: Object
		},

		weeklySummary: {
			type: Object
		},

		button: {
			type: String
		},

		showButton: {
			type: Boolean
		}
	}
}
</script>

<style lang="scss" scoped>
.header {
	max-width: 900px;
	display: flex;
	background-color: #272727;
    height: 50px;
    align-items: center;
	padding: 0 15px;
	position: relative;
}

.text {
	max-width: 740px;
	display: flex;
    height: 50px;
    align-items: center;
	position: relative;
}

h1 {
	margin: 0 10px 0 0;
	font-size: 15px;
}

p {
	margin: 0 20px 0 0;
}

span {
	font-size: 15px;
}

p:first-of-type {
	margin: 0 35px 0 0;
}

.button {
	position: absolute;
	right: 15px;
}
</style>