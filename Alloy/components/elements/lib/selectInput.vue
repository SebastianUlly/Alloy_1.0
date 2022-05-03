<template>
  <div>
    <span> {{ label }}</span>
    <select v-model="selectedValue" name="" id="selector">
      <option value="">Bitte wahlen Sie</option>
      <option :key="index" v-for="(item, index) of options" :value="item">
        {{ item }}
      </option>
    </select>
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
      requred: true,
    },
    options: {
      type: Array,
      required: false,
      default: null,
    },
    required: {
      type: Boolean,
    },
  },
  data() {
    return { selectedValue: "" };
  },
  methods: {},

  mounted() {},
};
</script>

<style scoped>
select {
  border: solid white 2px;
  border-radius: 4px;
  margin: 0 auto;
  width: 100%;
  color: white;
}
div {
  margin: auto;
  width: 100%;
  padding: 0 15px;
}
</style>
