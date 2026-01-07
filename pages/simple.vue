<template>
  <div>
    <h1>SIMPLE TEST</h1>
    <p>Si vous voyez ce texte, Vue fonctionne.</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
console.log('Simple page loaded')
</script>

<style scoped>
div {
  background: white;
  color: black;
  padding: 20px;
  font-family: Arial;
}

h1 {
  color: red;
  font-size: 40px;
}

p {
  font-size: 20px;
}
</style>
