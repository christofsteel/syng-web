<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'admin']);
</script>

<template>
  <div class="tabs-panel" id="queue-list">
    <QueueInner :queue="queue" :admin="admin" />
  </div>
</template>
