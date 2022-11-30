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
			<span
				v-if="weeklySummary.hoursaldo[0] !== '-'"
			>
				+{{ weeklySummary.hoursaldo }}
			</span>
			<span
				v-else
			>
				{{ weeklySummary.hoursaldo }}
			</span>
			<v-icon>
				mdi-clock-outline
			</v-icon>
		</p>
		<p v-if="weeklySummary.holiday">
			<span>
				Urlaub:
			</span>
			<span>
				+{{ weeklySummary.holiday }}
			</span>
			<span>
				({{ userInfo.holiday }})
			</span>
			<v-icon>
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
			class="button"
		>
			KW Freigeben
		</v-btn>
		<v-btn
			v-if="button === 'pdf'"
			class="button"
		>
			PDF
			<v-icon>
				mdi-file-download-outline
			</v-icon>
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
		}
	}
}
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	background-color: #272727;
    height: 50px;
    align-items: center;
    padding: 0 15px;
	position: relative;
}

h1 {
	margin: 0 30px 0 0;
}

p {
	margin: 0 40px 0 0;
}

p:first-of-type {
	margin: 0 100px 0 0;
}

.button {
	position: relative;
}
</style>