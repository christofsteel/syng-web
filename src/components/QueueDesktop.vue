<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'waiting_room', 'admin', 'waiting_room_policy']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue'])
</script>

<template>
  <div class="comp-column">
    <div class="header">Queue</div>
    <QueueInner
      :queue="queue"
      :admin="admin"
      :waiting_room="waiting_room"
      :waiting_room_policy="waiting_room_policy"
      @skip="(uuid) => $emit('skip', uuid)"
      @moveUp="(uuid) => $emit('moveUp', uuid)"
      @skipCurrent="$emit('skipCurrent')"
      @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
    />
  </div>
</template>
<style scoped>
.comp-column {
    margin: 0.2em 0.1em 0.1em 0.2em;
}
</style>
