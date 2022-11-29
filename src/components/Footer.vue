<script setup>
const props = defineProps(['name'])
const emits = defineEmits(['update:name'])
</script>
<template>
  <footer>
    Name: <span
      class="userName"
      @keyup.enter="(evt) => evt.target.blur()"
      @focusout="(evt) => $emit('update:name', evt.target.textContent)"
      contenteditable
      >
      {{ name }}
    </span>
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
