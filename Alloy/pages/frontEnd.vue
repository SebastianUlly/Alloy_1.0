<template>
  <div>
    <div class="leftSection">
    <projektListe />
    </div>
  </div>
</template>
<script>
  import projektListe from "~/components/frontEnd/projektListe";
  import search from "~/components/frontEnd/search";
  export default {
    components: {
      projektListe
    },
	methods: {

	}
  };
</script>
<style>
  .leftSection{
    max-width: 60%;
  }


</style>
