<script setup>
const props = defineProps(['name', 'admin', 'kiosk'])
const emits = defineEmits(['update:name', 'logout', 'config'])
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
    <div class="button alert fright" @click="$emit('logout')">Log out</div>
    <div v-if="admin" class="button alert fright" @click="$emit('config')">Config</div>
  </footer>
</template>
<style scoped>
footer {
  position: fixed;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  width: 100%;
  padding-left: 10px;
  background-color: #008000;
  font-weight: bold;
  color: #ffffff;
  font-size: 1.5rem;
  margin: auto;
}

footer > .button {
margin-top: 5px;
margin-right: 5px;
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
