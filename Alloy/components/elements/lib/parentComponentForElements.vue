<template>
  <div class="labeldiv">
    <div v-for="item of children" :key="item.elementId">
      <component
        :is="item.componentId"
        :elementId="item.elementId"
        :label="item.label"
		:parameters="item.parameters"
      />
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
export default {
	props: {
		label: {
			type: String,
			required: true,
		},
		children: {
			type: Array,
			required: true,
		},
		elementId: {
			type: String,
			required: true,
		},
		parameters: {
			type: Object,
			required: false,
			default: null,
		}
	}
};
</script>
<style scoped>
</style>
