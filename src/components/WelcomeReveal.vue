<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import $ from 'jquery'

const emits = defineEmits(['connect', 'update:room', 'update:name', 'update:server', 'update:secret', 'update:kiosk'])
const props = defineProps(['room', 'server', 'secret', 'name', 'joinMsg', 'kiosk'])

onMounted(() => {
  $(document).foundation();
  $("#welcome").foundation("open")
})

onBeforeUnmount(() => {
  $("#welcome").foundation("close")
})
</script>
<template>
<div class="reveal" id="welcome" @keyup.enter="$emit('connect')" data-reveal data-close-on-esc="false" data-close-on-click="false">
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
          <input type="text" @input="$emit('update:name', $event.target.value)" :value="name" placeholder="Arno Nym">
        </label>
      </div>
    </div>
  </div>
  <p v-html="joinMsg">
  </p>
  <button class="button expanded" @click="$emit('connect')">Connect</button>
  <ul class="accordion" data-accordion>
    <li class="accordion-item" data-accordion-item>
      <a href="#" class="accordion-title">Advanced</a>
      <div class="accordion-content" data-tab-content>
        <div class="grid-container">
          <div class="grid-x grid-padding-x">
            <div class="medium-6 cell">
              <label>Syng server
                <input type="text" :value="server" @input="$emit('update:server', $event.target.value)">
              </label>
            </div>
            <div class="medium-6 cell">
              <label>Admin password
                <input type="password" @input="$emit('update:secret', $event.target.value)" :value="secret" placeholder="Leave free, if not admin">
              </label>
            </div>
            <div class="medium-12 cell">
                <label>Kiosk mode
                  <input type="checkbox" id="kiosk" @change="$emit('update:kiosk', $event.target.checked)">
                </label>
              </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
    <p class="privacy-link">
      <a href="https://site.syng.rocks/privacy.html`" target="_blank">Privacy Policy</a>
      </p>
</div>
</template>

<style scoped>
.privacy-link {
  font-size: 0.8em;
  color: #666;
text-align: right;
}
</style>
