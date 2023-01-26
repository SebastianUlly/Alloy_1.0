<template>
	<div class="header">
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
		<v-btn
			v-if="button === 'sign'"
			class="sign-button"
			color="green"
			@click="$emit('releaseKW')"
		>
			Freigeben
		</v-btn>
		<!-- <v-btn
			v-if="button === 'pdf'"
			class="button"
		>
			PDF
			<v-icon>
				mdi-file-download-outline
			</v-icon>
		</v-btn> -->
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

h1 {
	margin: 0 30px 0 0;
	font-size: 17px;
}

p {
	margin: 0 25px 0 0;
}

p:first-of-type {
	margin: 0 55px 0 0;
}

.button {
	position: relative;
}

span{
	font-size: 17px;
}
</style>