<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'admin']);
</script>

<template>
  <div class="comp-column" id="middle">
    <div class="header">Queue</div>
    <QueueInner :queue="queue" :admin="admin" />
  </div>
</template>
