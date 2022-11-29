<script setup>
import SearchDesktop from './SearchDesktop.vue'
import QueueDesktop from './QueueDesktop.vue'
import RecentDesktop from './RecentDesktop.vue'

const props = defineProps(['state']);
const emit = defineEmits(['update:searchTerm', 'search', 'append', 'skip', 'skipCurrent', 'moveUp'])
</script>


<template>
  <div class="splitter">
    <SearchDesktop :search="state.search" :searching="state.searching" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" @append="(entry) => $emit('append', entry)" />
    <QueueDesktop
      :queue="state.queue"
      :admin="state.admin"
      @skip="(uuid) => $emit('skip', uuid)"
      @moveUp="(uuid) => $emit('moveUp', uuid)"
      @skipCurrent="$emit('skipCurrent')"
    /> 
    <RecentDesktop :recent="state.recent" :admin="state.admin" />
  </div>
</template>
<style scoped>
.splitter {
    display: flex;
    height: 100%;
}
</style>
