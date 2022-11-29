<script setup>
import { onMounted, reactive } from 'vue'
import Entry from './Entry.vue'

const props = defineProps(['queue', 'admin']);
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp'])

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
          <ul id="queue" class="vertical menu">
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
          />
          </ul>
      </div>
  </div>
</template>
