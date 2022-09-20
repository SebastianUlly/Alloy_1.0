<template>
  <div class="background">
    <div class="leftSection">
    <projektListe />
    </div>
  </div>
</template>
<script>
  import projektListe from "~/components/frontEnd/projektListe";
  export default {
    components: {
      projektListe
    },
	methods: {

	}
  };
</script>
<style scoped>
  .leftSection{
    /* max-width: 100%; */
  }


</style>
