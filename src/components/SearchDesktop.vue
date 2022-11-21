<script setup>
import SearchResults from './SearchResults.vue'
import SearchBar from './SearchBar.vue'

const props = defineProps(['search']);
const emit = defineEmits(['update:searchTerm', 'search', 'append'])
</script>

<template>
  <div class="comp-column" id="left-side">
      <div class="header">Search</div>
      <div class="vsplit">
        <SearchBar :searchTerm="search.searchTerm" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" />
        <SearchResults :searchResults="search.searchResults" @append="(entry) => $emit('append', entry)" />
      </div>
  </div>
</template>
