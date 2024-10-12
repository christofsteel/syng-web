<script setup>
import SearchDesktop from './SearchDesktop.vue'
import QueueDesktop from './QueueDesktop.vue'
import RecentDesktop from './RecentDesktop.vue'

const props = defineProps(['state']);
const emit = defineEmits(['update:searchTerm', 'search', 'append', 'skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'notify_disable', 'notify_enable'])
</script>


<template>
  <div class="splitter">
    <SearchDesktop :socket="state.socket" :search="state.search" :searching="state.searching" @update:searchTerm="(val) => $emit('update:searchTerm', val)" @search="$emit('search')" @append="(entry) => $emit('append', entry)" />
    <QueueDesktop
      :socket="state.socket"
      :queue="state.queue"
      :waiting_room="state.waiting_room"
      :waiting_room_policy="state.waiting_room_policy"
      :admin="state.admin"
      :notify_me="state.notify_me"
      @notify_enable="(uuid) => $emit('notify_enable', uuid)"
      @notify_disable="(uuid) => $emit('notify_disable', uuid)"
      @skip="(uuid) => $emit('skip', uuid)"
      @moveUp="(uuid) => $emit('moveUp', uuid)"
      @skipCurrent="$emit('skipCurrent')"
      @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
    /> 
    <RecentDesktop :recent="state.recent" :admin="state.admin" />
  </div>
</template>
<style scoped>
.splitter {
    display: flex;
    height: 100%;
}
</style>
