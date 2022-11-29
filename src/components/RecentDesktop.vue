<script setup>
import RecentInner from './RecentInner.vue'

const props = defineProps(['recent', 'admin'])
</script>
<template>
  <div class="comp-column">
    <div class="header">Recent</div>
    <RecentInner :recent="recent" />
  </div>
</template>
<style scoped>
.comp-column {
    margin: 0.2em 0.2em 0.1em 0.2em;
}
</style>
