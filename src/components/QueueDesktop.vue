<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'admin']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp'])
</script>

<template>
  <div class="comp-column">
    <div class="header">Queue</div>
    <QueueInner
      :queue="queue"
      :admin="admin"
      @skip="(uuid) => $emit('skip', uuid)"
      @moveUp="(uuid) => $emit('moveUp', uuid)"
      @skipCurrent="$emit('skipCurrent')"
    />
  </div>
</template>
<style scoped>
.comp-column {
    margin: 0.2em 0.1em 0.1em 0.2em;
}
</style>
