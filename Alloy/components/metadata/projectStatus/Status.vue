<template>
  <div>
    <selectInput
      :elementId="elementId"
      :children="children"
      :label="label"
      :options="parameters.options"
      :required="parameters.required"
    />
  </div>
</template>

<script>
export default {
  props: {
    elementId: {
      type: String,
      required: false,
    },
    children: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    parameters: {
      type: Object,
      required: false,
      default: null,
    },
  },
};
</script>
