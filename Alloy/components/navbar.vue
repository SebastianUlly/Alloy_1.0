<template>
	<v-app-bar id="navbar">
		<!-- button to navigate to the startpage -->
		<v-btn text to="/">
			Home
		</v-btn>
		<!-- button to navigate to the dataEditor, but only if the logged in user is allowed to -->
		<v-btn
			text
			to="/dataEditor"
		>
			Data Editor
		</v-btn>
		<v-btn
			text
			to="/pointEditor"
		>
			Point Editor
		</v-btn>
		<!-- button to navigate to the schemaEditor, but only if the logged in user is allowed to -->
		<v-btn
			text
			to="/schemaEditor"
		>
			Schema Editor
		</v-btn>
	</v-app-bar>
</template>

<style>
#navbar {
	max-height: 55px;
}
</style>
