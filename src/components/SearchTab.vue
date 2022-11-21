<script setup>
import SearchBar from './SearchBar.vue'
import SearchResults from './SearchResults.vue'

const props = defineProps(['search']);
const emit = defineEmits(['update:searchTerm'])
</script>

<template>
<div class="tabs-panel is-active" id="simplesearch">
    <div class="vsplit">
      <SearchBar :searchTerm="search.searchTerm" @update:searchTerm="(val) => $emit('update:searchTerm', val)"/>
      <SearchResults />
    </div>
</div>
</template>
