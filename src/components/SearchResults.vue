<script setup>
  import Result from './Result.vue'
const props = defineProps(['searchResults']);
</script>

<template>
<div id="search-results" class="results">
  <ul class="vertical menu">
    <Result v-for="result in searchResults" :result="result" />
  </ul>
</div>
</template>

<style scoped>
#search-results div {
    vertical-align: middle;
    height: 100%
}
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
