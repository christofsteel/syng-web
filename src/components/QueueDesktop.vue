<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['socket','queue', 'waiting_room', 'admin', 'waiting_room_policy', 'notify_me']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'notify_disable', 'notify_enable'])
</script>

<template>
  <div class="comp-column">
    <div class="header">Queue</div>
    <QueueInner
      :socket="socket"
      :queue="queue"
      :admin="admin"
      :waiting_room="waiting_room"
      :waiting_room_policy="waiting_room_policy"
      :notify_me="notify_me"
      @notify_enable="(uuid) => $emit('notify_enable', uuid)"
      @notify_disable="(uuid) => $emit('notify_disable', uuid)"
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
