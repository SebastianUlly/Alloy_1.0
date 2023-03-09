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
					({{ weeklyWorkTimeOfUser }})
				</span>
			</p>
			
		</div>
		<v-btn
			color="green"
			class="button"
			@click="$emit('refreshKW')"
		>	
			<v-icon>	
				mdi-refresh
			</v-icon>
		</v-btn>
		<v-spacer/>
		<!-- {{ weeklySummary.releaseOrSignObj }}{{ stateOfPoints }} -->
		<div v-if="weeklySummary.releaseOrSignObj.isLoggedInUser">
			<div v-if="weeklySummary.releaseOrSignObj.signed">
				Signiert am: {{  signDate }}
			</div>
			<div v-else-if="stateOfPoints === 'needToBeSigned'">
				Warten auf Signatur 
			</div>
		</div>
		<div v-else>
			<div v-if="weeklySummary.releaseOrSignObj.signed">
				Signiert am: {{  signDate }}
			</div>
			<div v-else-if="stateOfPoints === 'needToBeReleased'">
				Warten auf Freigabe
			</div>
		</div>
		<v-btn
			v-if="button === 'release' && showButton"
			color="green"
			class="button"
			@click="$emit('releaseKW')"
		>
			Freigeben
		</v-btn>
		<v-btn
			v-if="!weeklySummary.releaseOrSignObj.signed && button === 'sign' && showButton"
			color="green"
			class="button"
			@click="$emit('signTheKW')"
		>
			Signieren
		</v-btn>
		<!-- <v-btn color="red" @click="$emit('reset')">
			Reset
		</v-btn> -->
	</div>
</template>

<script>
export default {
	props: {
		headline: {
			type: String
		},

		weeklyWorkTimeOfUser: {
			type: Number
		},

		weeklySummary: {
			type: Object
		},

		button: {
			type: String
		},

		showButton: {
			type: Boolean
		},

		stateOfPoints: {
			type: String
		}
	},

	computed: {
		signDate () {
			let signDate
			if (this.weeklySummary.releaseOrSignObj.signed) {
				signDate = this.weeklySummary.releaseOrSignObj.signed.split('T')[0].split('-')[2] + '.'
						+ this.weeklySummary.releaseOrSignObj.signed.split('T')[0].split('-')[1] + '.'
						+ this.weeklySummary.releaseOrSignObj.signed.split('T')[0].split('-')[0]
			}
			return signDate
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
	margin: 5px;
}
</style>