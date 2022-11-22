<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import { io } from "socket.io-client"
import { useRoute, useRouter } from 'vue-router'

import MobileLayout from './components/MobileLayout.vue'
import DesktopLayout from './components/DesktopLayout.vue'
import WelcomeReveal from './components/WelcomeReveal.vue'

const router=useRouter()

function resizeBrowserHandler (e) {
    is_small.value = (e.target.innerWidth < 768)
}

const is_small = ref(window.innerWidth < 768)
const state = ref({
'search': {'searchTerm': '', 'searchResults': []},
'queue': [ ],
'room': useRoute().params.room,
'name': undefined,
'joined': false
})

onMounted(() => {
  window.addEventListener("resize", resizeBrowserHandler)
})

function setRoomCode(room) {
state.value.room = room
}

function setName(name) {
state.value.name = name
}

function updateSearchTerm(val) {
state.value.search.searchTerm = val
}

const socket = io()

function search() {
  socket.emit("search", {"query": state.value.search.searchTerm })
}

function append(entry) {
  socket.emit("append", {"id": entry.id, "performer": state.value.name, "source": entry.source })
}

function joinRoom() {
  socket.emit("register-web", {"room": state.value.room}, (response) => {
    if(response === true) {
      state.value.joined = true
      router.push({name: "room", params: {room: state.value.room}})
    } else {
      console.log("no such room")
    }
  })
}

socket.on("search-results", (results) => {
  state.value.search.searchResults = results
})

socket.on("connect", () =>
  { 
  joinRoom()
  }
  )

socket.on("state", (val) => {
  state.value.queue=val.queue
  state.value.recent=val.recent
})
</script>

<script>
</script>

<template>
<div class="page">
    <div class="row" id="main-content">
      <MobileLayout v-show="is_small" :state="state" @update:searchTerm="updateSearchTerm" />
      <DesktopLayout v-show="!is_small" :state="state" @update:searchTerm="updateSearchTerm" @search="search" @append="append" />
      <WelcomeReveal v-if="!state.joined" :room="state.room" @connect="joinRoom" @update:room="setRoomCode" @update:name="setName" />
    </div>
  </div>
</template>

<style scoped>
.page {
    height: 100vh;
    position: relative;
}
#main-content {
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
}
</style>
<style>
.row {
    margin:0 !important;
    max-width: 100% !important;
}

body {
    background: url(../syng.png) fixed;
    background-color: #8a8a8a;
    background-size: auto 50%;
    background-repeat: no-repeat;
    background-position: center;
    height:100vh;
}
.vsplit {
    display: flex;
    height: 100%;
    flex-direction: column;
}
#large-current, #current, .button, button:focus {
    background-color: #008000;
}
</style>
