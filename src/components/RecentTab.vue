<script setup>
import RecentInner from './RecentInner.vue'

const props = defineProps(['recent'])
</script>

<template>
  <div class="tabs-panel" id="recent-list">
    <RecentInner :recent="recent" />
  </div>
</template>
