<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue']);
</script>

<template>
  <div class="comp-column" id="middle">
    <div class="header">Queue</div>
    <QueueInner :queue="queue" />
  </div>
</template>
