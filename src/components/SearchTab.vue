<script setup>
import SearchResults from './SearchResults.vue'
import SearchBar from './SearchBar.vue'
</script>

<template>
<div class="tabs-panel is-active" id="simplesearch">
    <div class="vsplit">
      <SearchBar />
      <SearchResults />
    </div>
</div>
</template>
