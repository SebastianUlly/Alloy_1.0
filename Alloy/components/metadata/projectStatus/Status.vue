<template>
    <div>
    <span> {{ label }}</span>
    <select v-model="selectedPharmacy" name="" id="selector">
      <option value="" disabled selected>Bitte wählen sie die Zustand aus</option>
      <option value="Zustand1">Zustand 1</option>
      <option value="Zuzstand2">Zustand 2</option>
      <option value="Zustand3">Zustand 3</option>
    </select>
  </div>
</template>

<script>
export default{

}

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
