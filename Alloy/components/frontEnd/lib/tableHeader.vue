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
		<div v-if="weeklySummary.releaseOrSignObj.signed">
			Signiert am: {{  signDate }}
		</div>
		<div v-else-if="weeklySummary.releaseOrSignObj.released">
			Warten auf Freigabe
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
			v-if="button === 'sign' && showButton"
			color="green"
			class="button"
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