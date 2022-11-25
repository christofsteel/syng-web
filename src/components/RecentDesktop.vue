<script setup>
import RecentInner from './RecentInner.vue'

const props = defineProps(['recent', 'admin'])
</script>
<template>
  <div class="comp-column" id="right-side">
    <div class="header">Recent</div>
    <RecentInner :recent="recent" />
  </div>
</template>
