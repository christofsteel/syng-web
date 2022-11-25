<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import $ from 'jquery'

const emits = defineEmits(['connect', 'update:room', 'update:name', 'update:server', 'update:secret'])
const props = defineProps(['room', 'server'])

onMounted(() => {
  $(document).foundation();
  $("#welcome").foundation("open")
})

onBeforeUnmount(() => {
  $("#welcome").foundation("close")
})
</script>
<template>
<div class="reveal" id="welcome" data-reveal data-close-on-esc="false" data-close-on-click="false">
<h1>Welcome to Syng</h1>
<p>
  Please enter the room code and your name
</p>

  <div class="grid-container">
    <div class="grid-x grid-padding-x">
      <div class="medium-6 cell">
        <label>Syng server
          <input type="text" :value="server" @input="$emit('update:server', $event.target.value)">
        </label>
      </div>
      <div class="medium-6 cell">
        <label>Admin password
          <input type="password" @input="$emit('update:secret', $event.target.value)" placeholder="Leave free, if not admin">
        </label>
      </div>
      <div class="medium-6 cell">
        <label>Room code
          <input type="text" :value="room" @input="$emit('update:room', $event.target.value)" placeholder="ABCD">
        </label>
      </div>
      <div class="medium-6 cell">
        <label>Name
          <input type="text" @input="$emit('update:name', $event.target.value)" placeholder="Arno Nym">
        </label>
      </div>
    </div>
  </div>
  <button class="button expanded" @click="$emit('connect')">Connect</button>
</div>
</template>
