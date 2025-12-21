<script setup>
import { computed } from 'vue'
const props = defineProps(['admin', 'entry', 'current', 'firstStartedAt', 'offset', 'currentTime', 'waitingRoom'])
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp', 'waitingRoomToQueue', 'queueToWaitingRoom', 'moveTo'])

var in_touch_event = false

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
  if (props.waitingRoom || props.current || !props.admin) {
    return
  }
  if (e.type == 'touchstart') {
    e.preventDefault()
    in_touch_event = true
    const list_target = e.target.closest('li')
    list_target.style.opacity = 0.5
    return 
  }
  const element = e.target.closest('li')
 const data = {
   uuid: props.entry.uuid,
   index: $(element).index()    
  }
 e.dataTransfer.clearData()
 e.dataTransfer.setData('application/json', JSON.stringify(data))
 e.dataTransfer.setDragImage(element, 0, 0)
 e.dataTransfer.effectAllowed = 'move'
}

const dragend = (e) => {
  if (props.waitingRoom || props.current || !props.admin) {
    return
  }
  e.preventDefault()
  if (e.type == 'touchend') {
    in_touch_event = false
    const drop_target = document.getElementById('draggedover')
    if (drop_target) {
      drop_target.removeAttribute('id')
      drop_target.classList.remove('draggedoverTop')
      drop_target.classList.remove('draggedoverBottom')
    }
    e.target.closest('li').style.opacity = 1
    const drop_index = $(drop_target.closest('li')).index()
    const source_index = $(e.target.closest('li')).index()    
    if(source_index < drop_index) {
      emits('moveTo', {"uuid": props.entry.uuid, "target": drop_index + 1})
    } else {
      emits('moveTo', {"uuid": props.entry.uuid, "target": drop_index})
    }
    return
  }
  e.target.closest('li').classList.remove('draggedoverBottom')
  e.target.closest('li').classList.remove('draggedoverTop')
}

const dropped = (e) => {
  if (props.waitingRoom || props.current || !props.admin) {
    return
  }
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
  if (props.waitingRoom || props.current || !props.admin || !in_touch_event) {
    return
  }
  e.preventDefault()
  var source_index = 0
  var target = null
  if (e.type == 'touchmove') {
    target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
    if (!target) {
      return
    }
    if(target.closest('li') == null || target.closest('li').classList.contains('current') || target.closest('li').classList.contains('waitingRoom')) {
      return
    }
    source_index = $(e.target.closest('li')).index()    
    const old_draggedover = document.getElementById('draggedover')
    if (old_draggedover) {
      old_draggedover.removeAttribute('id')
      old_draggedover.classList.remove('draggedoverTop')
      old_draggedover.classList.remove('draggedoverBottom')
    }
  } else { 
    e.dataTransfer.dropEffect = 'move'
    source_index = JSON.parse(e.dataTransfer.getData('application/json')).index
    target = e.target
  }
  target.closest('li').id = 'draggedover'
  const index = $(target.closest('li')).index()
  if (index < source_index) {
    target.closest('li').classList.add('draggedoverTop')
  } else {
    target.closest('li').classList.add('draggedoverBottom')
  }
}
const dragleave = (e) => {
  if (props.waitingRoom || props.current || !props.admin) {
    return
  }
  e.preventDefault()
  e.target.closest('li').classList.remove('draggedoverTop')
  e.target.closest('li').classList.remove('draggedoverBottom')
}

</script>

<template>
  <li :class="[{ current: current }, {waitingRoom: waitingRoom}]" class="entry" @dragover="dragover" @dragleave="dragleave" @dragend="dragend" @drop="dropped" @touchmove="dragover" @touchend="dragend">
      <div class="grid-x">
          <div class="cell" :class="{'small-9': admin}">
            <span v-if="admin && !current && !waitingRoom" class="handle" 
                :draggable="admin" 
                @dragstart="dragging" 
                @touchstart="dragging" 
                >
             ... ... ... ... ... ... ... ...
            </span>
            <span class="artist">{{ entry.artist }}</span>
            <span class="title">{{ entry.title }}</span><br />
            <span class="performer">{{ entry.performer }}</span>
            <span v-if="!current && !waitingRoom" class="eta">{{ eta }}</span>
        <span v-if="entry.collab_mode == 'solo'" class="badge">
          <font-awesome-icon icon="fa-solid fa-person" title="Solo Performance" />
          Only me/us
        </span>
        <span v-if="entry.collab_mode == 'solo'" class="badge">
          <font-awesome-icon icon="fa-solid fa-person" title="Solo Performance" />
          Looking for Partner
        </span>
        <span v-else-if="entry.collab_mode == 'group'" class="badge">
          <font-awesome-icon icon="fa-solid fa-people-group" title="Group Performance" />
          Everyone can join
        </span>
          </div>
          <div v-if="admin" class="cell small-3">
                  <button v-if="!waitingRoom" class="button alert fright" @click="skip">
                  <font-awesome-icon icon="fa-solid fa-times" />
                  </button>
                  <button 
                    class="button success fright" 
                    v-if="!waitingRoom && !current" 
                    @click="$emit('queueToWaitingRoom', entry.uuid)" >
                  <font-awesome-icon icon="fa-solid fa-arrows-down-to-line" />
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
span.badge {
    background-color: #007b00;
    color: white;
    padding: 2px 4px 0px 4px;
    border-radius: 4px;
    font-size: 0.75em;
    margin-left: 8px;
    vertical-align: middle;
}

span.handle {
  width: 25px;
  display: inline-block;
  overflow: hidden;
  line-height: 5px;
  cursor: move;
  vertical-align: middle;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 12px;
  font-family: sans-serif;
  letter-spacing: 2px;
  color: #cccccc;
height: 100%;
float: left;
  touch-action: none;
  text-shadow: 1px 0 1px black;
}
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


#draggedover.draggedoverTop {
  border-top: 2px solid #008000;
}

#draggedover.draggedoverBottom {
  border-bottom: 2px solid #008000;
}

</style>
