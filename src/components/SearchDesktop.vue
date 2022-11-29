<script setup>
import SearchResults from './SearchResults.vue'
import SearchBar from './SearchBar.vue'

const props = defineProps(['search', 'searching']);
const emit = defineEmits(['update:searchTerm', 'search', 'append'])
</script>

<template>
  <div class="comp-column">
      <div class="header">Search</div>
      <div class="vsplit">
        <SearchBar :searchTerm="search.searchTerm" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" />
        <SearchResults :searchResults="search.searchResults" :searching="searching" @append="(entry) => $emit('append', entry)" />
      </div>
  </div>
</template>
<style scoped>
.comp-column {
    margin: 0.2em 0.1em 0.2em 0.2em;
}

</style>
