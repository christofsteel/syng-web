<script setup>
import { computed } from 'vue'
const props = defineProps(['admin', 'entry', 'current', 'firstStartedAt', 'offset', 'currentTime'])
const emits = defineEmits(['skip', 'skipCurrent', 'moveUp'])

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
  
  if (isNaN(etaSeconds)) {
    return "error"
    } else {
  return new Date(etaSeconds * 1000).toISOString().substring(11,19)
  }
})

</script>

<template>
  <li :class="{ current: current }">
      <div class="grid-x">
          <div class="cell" :class="{'small-9': admin}">
            <span class="artist">{{ entry.artist }}</span>
            <span class="title">{{ entry.title }}</span><br />
            <span class="performer">{{ entry.performer }} [{{ entry.uid }}]</span>
            <span v-if="!current" class="eta">{{ eta }}</span>
          </div>
          <div v-if="admin" class="cell small-3">
                  <button class="button alert fright" @click="skip">
                  <font-awesome-icon icon="fa-solid fa-times" />
                  </button>
                  <button 
                    class="button alert fright" 
                    v-if="!current" 
                    @click="$emit('moveUp', entry.uuid)" >
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
