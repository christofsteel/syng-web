<script setup>
import { computed } from 'vue'
const props = defineProps(['socket', 'admin', 'entry', 'current', 'firstStartedAt', 'offset', 'currentTime', 'waitingRoom', 'isQueue', 'notify_me'])
const emits = defineEmits(['moveUp', 'waitingRoomToQueue', 'notify_enable', 'notify_disable'])

function skip() {
  if(props.current) {
     props.socket.emit("skip-current")
  } else {
     props.socket.emit("skip", {"uuid": props.entry.uuid})
  }
}

const eta = computed(() =>{
  let now = props.currentTime
  let startTime = new Date(props.firstStartedAt * 1000)
  let playBackSeconds = (now - startTime) / 1000
  let etaSeconds = Math.round(props.offset - playBackSeconds)
  
  if (isNaN(etaSeconds)) {
    return null
    } else {
  return new Date(etaSeconds * 1000).toISOString().substring(11,19)
  }
})

</script>

<template>
  <li :class="[{ current: current }, {waitingRoom: waitingRoom}]">
      <div class="grid-x">
          <div class="cell" :class="{'small-9': admin}">
            <span class="artist">{{ entry.artist }}</span>
            <span class="title">{{ entry.title }}</span><br />
            <span v-if="!current && !waitingRoom && isQueue" class="notify">
            <font-awesome-icon :icon="['far', 'bell']" v-if="notify_me.indexOf(entry.uuid) === -1" @click="$emit('notify_enable', entry.uuid)"/>
            <font-awesome-icon :icon="['fas', 'bell']" v-if="notify_me.indexOf(entry.uuid) !== -1" @click="$emit('notify_disable', entry.uuid)"/>
            </span>
            <span class="performer">{{ entry.performer }}</span>
            <span v-if="!current && !waitingRoom" class="eta">{{ eta }}</span>
          </div>
          <div v-if="admin" class="cell small-3">
                  <button v-if="!waitingRoom" class="button alert fright" @click="skip">
                  <font-awesome-icon icon="fa-solid fa-times" />
                  </button>
                  <button 
                    class="button success fright" 
                    v-if="waitingRoom" 
                    @click="socket.emit('waiting-room-to-queue', {'uuid': entry.uuid})" >
                  <font-awesome-icon icon="fa-solid fa-arrows-up-to-line" />
                  </button>
                  <button 
                    class="button warning fright" 
                    v-if="!current && !waitingRoom" 
                    @click="socket.emit('move-up', {'uuid': entry.uuid})" >
                  <font-awesome-icon icon="fa-solid fa-arrow-up" />
                  </button>
          </div>
      </div>

  </li>
</template>

<style scoped>
.current {
  background-color: #008000 !important;
}

.notify {
  display: inline;
  margin-right: 10px;
}

.current::before, #large-current::before{
    content: "Now Playing";
    text-align: center;
    font-weight: bold;
}

.eta {
    float: right;
}

.eta::before {
    content: "in ";
}

</style>
