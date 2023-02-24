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
		<v-spacer/>
		
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