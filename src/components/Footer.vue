<script setup>
const props = defineProps(['name', 'admin', 'kiosk', 'queue_locked', 'playing'])
const emits = defineEmits(['update:name', 'logout', 'config', 'lock_queue', 'play_pause'])
</script>
<template>
  <footer v-if="!kiosk">
    Name: <span
      class="userName"
      @keyup.enter="(evt) => evt.target.blur()"
      @focusout="(evt) => $emit('update:name', evt.target.textContent)"
      contenteditable
      >
      {{ name }}
    </span>
    <div class="button alert fright" @click="$emit('logout')">
      <font-awesome-icon icon="fa-solid fa-right-from-bracket">Log out</font-awesome-icon>
    </div>
    <!-- <div v-if="admin" class="button alert fright" @click="$emit('config')">Config</div> -->
    <div v-if="admin" class="button alert fright" @click="$emit('play_pause')">
      <font-awesome-icon icon="fa-solid fa-play" v-if="!playing">Play</font-awesome-icon>
      <font-awesome-icon icon="fa-solid fa-pause" v-if="playing">Pause</font-awesome-icon>
    </div>
    <div v-if="admin" class="button alert fright" @click="$emit('lock_queue')">
      <font-awesome-icon icon="fa-solid fa-lock-open" v-if="queue_locked">Unlock Queue</font-awesome-icon>
      <font-awesome-icon icon="fa-solid fa-lock" v-if="!queue_locked">Lock Queue</font-awesome-icon>
    </div>
  </footer>
</template>
<style scoped>
footer {
  position: fixed;
  bottom: 0;
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding-left: 10px;
  background-color: #008000;
  font-weight: bold;
  color: #ffffff;
  font-size: 1.0rem;
  margin: auto;
}

footer > .button {
margin-top: 3px;
margin-right: 3px;
  padding-left: 7px;
  padding-right: 7px;
  font-size: 0.75rem;
min-width: 3em;
}

footer > .userName {
  border: none;
  border-bottom: 1px dashed #00F000;
  background-color: #008000;
  min-width: 5em;
  display: inline-block;
  height: 70%;
  text-align: center;
}
</style>
