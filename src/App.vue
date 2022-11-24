<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import { io } from "socket.io-client"
import { useRoute, useRouter } from 'vue-router'

import MobileLayout from './components/MobileLayout.vue'
import DesktopLayout from './components/DesktopLayout.vue'
import WelcomeReveal from './components/WelcomeReveal.vue'

const router = useRouter()

const state = ref({
    'search': {'searchTerm': '', 'searchResults': []},
    'queue': [ ],
    'room': useRoute().params.room,
    'name': undefined,
    'joined': false,
    'server': window.location.protocol + "//" + window.location.host + "/",
    'socket': undefined, 
    'is_small': window.innerWidth < 768
})

onMounted(() => { window.addEventListener("resize", (e) => { state.value.is_small = (e.target.innerWidth < 768) }) } )

function setRoomCode(room) { state.value.room = room }
function setName(name) { state.value.name = name }
function updateName(evt) { state.value.name = evt.target.textContent }
function setServer(server) { state.value.server = server }
function setSearchTerm(searchTerm) { state.value.search.searchTerm = searchTerm }

function search() {
  state.socket.emit("search", {"query": state.value.search.searchTerm })
}

function append(entry) {
  state.socket.emit("append", {"id": entry.id, "performer": state.value.name, "source": entry.source })
}

function connect() {
  state.socket = io(state.value.server)
  console.log(state.socket)
  registerSocketEvents(state.socket)
}

function registerSocketEvents(socket) {
    socket.on("search-results", (results) => {
      state.value.search.searchResults = results
    })

    socket.on("connect", () => { joinRoom() })

    socket.on("state", (val) => {
      state.value.queue=val.queue
      state.value.recent=val.recent
    })
}

function joinRoom() {
    state.socket.emit("register-web", {"room": state.value.room}, (response) => {
    if(response === true) {
      state.value.joined = true
      router.push({name: "room", params: {room: state.value.room}})
    } else {
      console.log("no such room")
    }
  })
}
</script>

<script>
</script>

<template>
<div class="page">
  <div class="row" id="main-content">
    <MobileLayout v-show="state.is_small" :state="state" @update:searchTerm="setSearchTerm" @search="search" @append="append" />
    <DesktopLayout v-show="!state.is_small" :state="state" @update:searchTerm="setSearchTerm" @search="search" @append="append" />
    <WelcomeReveal v-if="!state.joined" :room="state.room" :server="state.server" @connect="connect" @update:room="setRoomCode" @update:name="setName" @update:server="setServer" />
  </div>
<footer>
Name: <span class="userName" @focusout="updateName" contenteditable>{{ state.name }}</span>
</footer>
</div>
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

}
</style>
