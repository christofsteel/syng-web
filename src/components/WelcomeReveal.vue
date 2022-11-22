<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import $ from 'jquery'

const emits = defineEmits(['connect', 'update:room', 'update:name'])
const props = defineProps(['room'])

onMounted(() => {
  $(document).foundation();
  $("#welcome").foundation("open")
})

onBeforeUnmount(() => {
  $("#welcome").foundation("close")
})
</script>
<template>
<div class="reveal" id="welcome" data-reveal data-close-on-click="false">
<h1>Welcome to Syng</h1>
<p>
  Please enter the room code and your name
</p>

  <div class="grid-container">
    <div class="grid-x grid-padding-x">
      <div class="medium-6 cell">
        <label>Room code
          <input type="text" :value="room" @input="$emit('update:room', $event.target.value)" placeholder="ABCD">
        </label>
      </div>
      <div class="medium-6 cell">
        <label>Name
          <input type="text" @input="$emit('update:name', $event.target.value)" placeholder="Leave empty to be asked on append">
        </label>
      </div>
    </div>
  </div>
  <button class="button" @click="$emit('connect')">Connect</button>
<button class="close-button" data-close aria-label="Close reveal" type="button">
  <span aria-hidden="true">&times;</span>
</button>
</div>
</template>
