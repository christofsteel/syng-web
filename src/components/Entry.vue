<script setup>
import { computed } from 'vue'
const props = defineProps(['admin', 'entry', 'current', 'firstStartedAt', 'offset', 'currentTime', 'waitingRoom'])
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'moveTo'])

function skip() {
  if(props.current) {
     emits("skipCurrent")
  } else {
     emits("skip", props.entry.uuid)
  }
}

const eta = computed(() =>{
  let now = props.currentTime
  let startTime = new Date(props.firstStartedAt * 1000)
  let playBackSeconds = (now - startTime) / 1000
  let etaSeconds = Math.round(props.offset - playBackSeconds)
  if (etaSeconds < 0) {
    etaSeconds = 0
  }
  
  if (isNaN(etaSeconds)) {
    return null
    } else {
  return new Date(etaSeconds * 1000).toISOString().substring(11,19)
  }
})

const dragging = (e) => {
 const data = {
   uuid: props.entry.uuid,
   index: $(e.target.closest('li')).index()}
   console.log(data)
 e.dataTransfer.clearData()
 e.dataTransfer.setData('application/json', JSON.stringify(data))
 e.dataTransfer.effectAllowed = 'move'
}

const dragend = (e) => {
  e.preventDefault()
  e.target.closest('li').classList.remove('draggedoverBottom')
  e.target.closest('li').classList.remove('draggedoverTop')
}

const dropped = (e) => {
  e.preventDefault()
  e.target.closest('li').classList.remove('draggedoverBottom')
  e.target.closest('li').classList.remove('draggedoverTop')
  const drop_index = $(e.target.closest('li')).index()
  const element = JSON.parse(e.dataTransfer.getData('application/json'))
  if (element.index < drop_index) {
    emits('moveTo', {"uuid": element.uuid  , "target": drop_index + 1})
  } else {
    emits('moveTo', {"uuid": element.uuid  , "target": drop_index})
    }
}

const dragover = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  const element = JSON.parse(e.dataTransfer.getData('application/json'))
  const index = $(e.target.closest('li')).index()
  if (index < element.index) {
    e.target.closest('li').classList.add('draggedoverTop')
  } else {
    e.target.closest('li').classList.add('draggedoverBottom')
  }
}
const dragleave = (e) => {
  e.preventDefault()
  e.target.closest('li').classList.remove('draggedoverTop')
  e.target.closest('li').classList.remove('draggedoverBottom')
}

</script>

<template>
  <li :class="[{ current: current }, {waitingRoom: waitingRoom}]" :draggable="admin" @dragstart="dragging" @dragend="dragend" @dragover="dragover" @dragleave="dragleave" @drop="dropped">
      <div class="grid-x">
          <div class="cell" :class="{'small-9': admin}">
            <span class="artist">{{ entry.artist }}</span>
            <span class="title">{{ entry.title }}</span><br />
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
                    @click="$emit('waitingRoomToQueue', entry.uuid)" >
                  <font-awesome-icon icon="fa-solid fa-arrows-up-to-line" />
                  </button>
                  <!-- <button  -->
                  <!--   class="button warning fright"  -->
                  <!--   v-if="!current && !waitingRoom"  -->
                  <!--   @click="$emit('moveUp', entry.uuid)" > -->
                  <!-- <font-awesome-icon icon="fa-solid fa-arrow-up" /> -->
                  <!-- </button> -->
          </div>
      </div>

  </li>
</template>

<style scoped>
.current {
  background-color: #008000 !important;
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

.draggedoverTop {
  border-top: 2px solid #008000;
}

.draggedoverBottom {
  border-bottom: 2px solid #008000;
}

</style>
