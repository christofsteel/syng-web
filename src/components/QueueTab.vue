<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'waiting_room', 'admin', 'max_songs_per_person']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'queueToWaitingRoom', 'moveTo'])
</script>

<template>
  <div class="tabs-panel" id="queue-list">
    <QueueInner 
      :queue="queue" 
      :admin="admin" 
      :waiting_room="waiting_room"
      :max_songs_per_person="max_songs_per_person"
      @skip="(uuid) => $emit('skip', uuid)" 
      @moveUp="(uuid) => $emit('moveUp', uuid)" 
      @skipCurrent="$emit('skipCurrent')"
      @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
      @queueToWaitingRoom="(uuid) => $emit('queueToWaitingRoom', uuid)"
      @moveTo="(data) => $emit('moveTo', data)"
    />
</div>
</template>
