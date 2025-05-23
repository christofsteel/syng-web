<script setup>
import { onMounted, reactive } from 'vue'
import Entry from './Entry.vue'

const props = defineProps(['queue', 'waiting_room', 'admin', 'waiting_room_policy']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'queueToWaitingRoom', 'moveTo'])

let currentTime = reactive({time: Date.now()})

function updateNow() {
  currentTime.time = Date.now()
}

onMounted(() => {
  updateNow()
  setInterval(updateNow.bind(this), 1000)
})

function offset(index) {
  let _offset = 0
  for(let i = 0; i < index; i++) {
    _offset += props.queue[i].duration    
  }
  return _offset
}



</script>

<template>
  <div class="vsplit">
      <div id="queue-list-wrapper" class="results">
          <ul id="queue" class="vertical menu" @drop="dropHandler">
          <Entry 
            v-for="(entry, index) in queue" 
            :entry="entry" 
            :current="index == 0" 
            :admin="admin"
            :firstStartedAt="queue[0].started_at"
            :currentTime="currentTime.time"
            :offset="offset(index)"
            @skip="(uuid) => $emit('skip', uuid)" 
            @skipCurrent="$emit('skipCurrent')"
            @moveUp="(uuid) => $emit('moveUp', uuid)" 
            @moveTo="(data) => $emit('moveTo', data)"
            @queueToWaitingRoom="(uuid) => $emit('queueToWaitingRoom', uuid)"
          />
          </ul>
          <div v-show="waiting_room_policy" class="header">Waiting room</div>
          <ul id="waiting_room" class="vertical menu">
          <Entry v-show="waiting_room_policy"
            v-for="(entry, index) in waiting_room" 
            :entry="entry" 
            :admin="admin"
            :waitingRoom="true"
            @skip="(uuid) => $emit('skip', uuid)" 
            @skipCurrent="$emit('skipCurrent')"
            @moveUp="(uuid) => $emit('moveUp', uuid)" 
            @waitingRoomToQueue="(uuid) => $emit('waitingRoomToQueue', uuid)"
          />
          </ul>
      </div>
  </div>
</template>
<style scoped>

#waiting_room li{
    opacity: 0.5;
  }
#waiting_room .heading {
  background: #00ff00;
  font-weight: bold;
}

.menu {
  margin-bottom: .5rem;
}
</style>
