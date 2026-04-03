<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['queue', 'waiting_room', 'admin', 'max_songs_per_person', 'locked']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'queueToWaitingRoom', 'moveTo'])
</script>

<template>
  <div class="comp-column">
    <div class="header">Queue <font-awesome-icon v-if="locked" icon="fa-solid fa-lock" /></div>
    <QueueInner
      :queue="queue"
      :admin="admin"
      :waiting_room="waiting_room"
      :max_songs_per_person="max_songs_per_person"
      @skip="(uuid) => $emit('skip', uuid)"
      @moveUp="(uuid) => $emit('moveUp', uuid)"
      @moveTo="(data) => $emit('moveTo', data)"
      @skipCurrent="$emit('skipCurrent')"
      @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
      @queueToWaitingRoom="(uuid) => $emit('queueToWaitingRoom', uuid)"
    />
  </div>
</template>
<style scoped>
.comp-column {
    margin: 0.2em 0.1em 0.1em 0.2em;
}
</style>
