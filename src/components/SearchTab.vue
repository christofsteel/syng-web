<script setup>
import SearchBar from './SearchBar.vue'
import SearchResults from './SearchResults.vue'

const props = defineProps(['search', 'searching']);
const emit = defineEmits(['update:searchTerm', 'search', 'append'])
</script>

<template>
<div class="tabs-panel is-active" id="simplesearch">
    <div class="vsplit">
      <SearchBar :searchTerm="search.searchTerm" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" />
      <SearchResults :searchResults="search.searchResults" :searching="searching" @append="(entry, configure) => $emit('append', entry, configure)" />
    </div>
</div>
</template>
