<template>
	<v-app>
		<Navbar />
		<v-main>
			<v-container>
				<nuxt />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
import Navbar from '~/components/navbar'

export default {
	components: {
		Navbar
	}
}
</script>
