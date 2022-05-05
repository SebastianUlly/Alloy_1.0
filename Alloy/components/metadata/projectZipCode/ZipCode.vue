<template>
  <div>
    <selectInput
      :label="label"
      :elementId="elementId"
      :options="parameters.options"
      :required="parameters.required"

    />
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      reuired: true,
    },
    elementId: {
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
