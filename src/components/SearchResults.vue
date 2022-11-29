<script setup>
  import Result from './Result.vue'
const props = defineProps(['searchResults', 'searching']);
const emits = defineEmits(['append'])
</script>

<template>
<div id="search-results" class="results">
  <ul class="vertical menu">
    <li v-if="searching">Searching...</li>
    <Result v-else v-for="result in searchResults" :result="result" @append="$emit('append', result)" />
  </ul>
</div>
</template>

<style scoped>
#search-results div {
    vertical-align: middle;
    height: 100%
}
</style>
