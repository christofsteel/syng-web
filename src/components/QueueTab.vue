<script setup>
import QueueInner from './QueueInner.vue'

const props = defineProps(['socket','queue', 'waiting_room', 'admin', 'waiting_room_policy', 'notify_me']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'notify_enable', 'notify_disable'])
</script>

<template>
  <div class="tabs-panel" id="queue-list">
    <QueueInner 
      :socket="socket"
      :queue="queue" 
      :admin="admin" 
      :waiting_room="waiting_room"
      :waiting_room_policy="waiting_room_policy"
      :notify_me="notify_me"
      @notify_disable="(uuid) => $emit('notify_disable', uuid)" 
      @notify_enable="(uuid) => $emit('notify_enable', uuid)" 
      @skip="(uuid) => $emit('skip', uuid)" 
      @moveUp="(uuid) => $emit('moveUp', uuid)" 
      @skipCurrent="$emit('skipCurrent')"
      @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
    />
</div>
</template>
