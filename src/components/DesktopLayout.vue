<script setup>
import SearchDesktop from './SearchDesktop.vue'
import QueueDesktop from './QueueDesktop.vue'
import RecentDesktop from './RecentDesktop.vue'

const props = defineProps(['state']);
const emit = defineEmits(['update:searchTerm', 'search', 'append'])
</script>


<template>
  <div class="splitter">
    <SearchDesktop :search="state.search" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" @append="(entry) => $emit('append', entry)" />
    <QueueDesktop :queue="state.queue" />
    <RecentDesktop :recent="state.recent" />
  </div>
</template>
