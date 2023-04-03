<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'waiting_room', 'admin']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp'])
</script>

<template>
  <div class="tabs-panel" id="queue-list">
    <QueueInner 
      :queue="queue" 
      :admin="admin" 
      :waiting_room="waiting_room"
      @skip="(uuid) => $emit('skip', uuid)" 
      @moveUp="(uuid) => $emit('moveUp', uuid)" 
      @skipCurrent="$emit('skipCurrent')"
      />
  </div>
</template>
