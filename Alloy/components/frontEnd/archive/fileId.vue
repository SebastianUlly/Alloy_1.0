<template> 
    <div>
        <div v-for="(element, key) of children" :key="element.elementId">
            <component 
                :is="element.componentId"
                v-if="!element.parentId"
                :element-id="element.elementId"
                :children="element.children"
                :label="element.label"
                :parameters="element.parameters"
            />     
        </div> 

        <vue-json-pretty :data="children" />
    </div>
</template>
<script>
/* import inputField from '' */
export default{
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
    components:{
        /* inputField */
    }

}
</script>