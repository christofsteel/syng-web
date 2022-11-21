<script setup>
import QueueInner from './QueueInner.vue'
</script>

<script>
export default {
  props: ['queue']
}
</script>

<template>
  <div class="tabs-panel" id="queue-list">
    <QueueInner :queue="queue" />
  </div>
</template>
