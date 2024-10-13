<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'waiting_room', 'admin', 'waiting_room_policy']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'moveTo'])
</script>

<template>
  <div class="tabs-panel" id="queue-list">
    <QueueInner 
      :queue="queue" 
      :admin="admin" 
      :waiting_room="waiting_room"
      :waiting_room_policy="waiting_room_policy"
      @skip="(uuid) => $emit('skip', uuid)" 
      @moveUp="(uuid) => $emit('moveUp', uuid)" 
      @skipCurrent="$emit('skipCurrent')"
      @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
      @moveTo="(data) => $emit('moveTo', data)"
    />
</div>
</template>
