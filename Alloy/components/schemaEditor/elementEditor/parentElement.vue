<template>
	<ul>
		<li
			v-for="item of children"
			:key="item.elementId"
			class="component-container"
		>
			<display-component
				class="component"
				:label="item.label"
				:element-id="item.elementId"
				:parameters="item.parameters"
			/>
		</li>
	</ul>
</template>

<script>
import displayComponent from '../displayComponent.vue';
export default {
 	components: {
		displayComponent
	},

	props: {
		elementId: {
			type: String,
			required: true
		},
		children: {
			type: Array,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},
};
</script>

<style lang="scss" scoped>
.component-container {
	display: flex;
	align-items: center;
}

.component {
	width: 100%;
}

ul {
	list-style-type: disc;
	display: block;
}
</style>