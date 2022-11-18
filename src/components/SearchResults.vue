<script setup>
  import Result from './Result.vue'
</script>

<template>
<div id="search-results" class="results">
  <ul class="vertical menu">
    <li> <Result artist="Linkin Park" title="In The End" album="Hybrid Theory"/> </li>
    <li> <Result artist="ZSK" title="Herz für die Sache" album="Herz für die Sache"/> </li>
    <li> <Result artist="Die Kassierer" title="Das Schlimmste" album="irgendwas mit Bier"/> </li>
  </ul>
</div>
</template>

<style scoped>
.results {
  flex: 1;
  overflow-y: auto;
}
.menu li {
padding: 0.4em;
}
.menu li:nth-child(odd) {
    background-color: #e6e6e6;
}

.menu li:nth-child(even) {
    background-color: #f6f6f6;
}
</style>
