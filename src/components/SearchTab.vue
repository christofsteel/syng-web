<script setup>
import SearchBar from './SearchBar.vue'
import SearchResults from './SearchResults.vue'

const props = defineProps(['search']);
const emit = defineEmits(['update:searchTerm', 'search'])
</script>

<template>
<div class="tabs-panel is-active" id="simplesearch">
    <div class="vsplit">
      <SearchBar :searchTerm="search.searchTerm" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" />
      <SearchResults :searchResults="search.searchResults" />
    </div>
</div>
</template>
