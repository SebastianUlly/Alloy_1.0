
<template>
  <div>
    <selectInput
      :label="label"
      :elementId="elementId"
      :options="parameters.options"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
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
    },
  },
  data() {
    return { vorwahl: "" };
  },
  watch: {
    vorwahl: {
      handler() {},
    },
  },
};
</script>

