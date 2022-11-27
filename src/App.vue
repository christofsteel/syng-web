<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import { io } from "socket.io-client"
import { useRoute, useRouter } from 'vue-router'
import $ from 'jquery'

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
    'is_small': window.innerWidth < 768,
    'admin': false,
    'secret': undefined,
    'current_entry': undefined,
    'current_name': undefined,
})

onMounted(() => { 
  window.addEventListener("resize", (e) => { state.value.is_small = (e.target.innerWidth < 768) });
  $(document).foundation();
})

function setRoomCode(room) { state.value.room = room }
function setSecret(secret) { state.value.secret = secret }
function setName(name) { state.value.name = name }
function setCurrentName(name) { state.value.current_name = name }
function updateName(evt) { evt.target.textContent = state.value.name;}
function setServer(server) { state.value.server = server }
function setSearchTerm(searchTerm) { state.value.search.searchTerm = searchTerm }

function search() {
  state.socket.emit("search", {"query": state.value.search.searchTerm })
}

function append(entry) {_append(entry, state.value.name) }
function _append(entry, name) {
  if(name == "" || name == undefined) {
    state.value.current_entry = entry
    $("#getusername").foundation("open")
  } else {
      $("#getusername").foundation("close")
      state.value.current_entry = undefined
      state.value.current_name = undefined
      state.socket.emit("append", {"id": entry.id, "performer": name, "source": entry.source })
  }
}

function connect() {
  state.socket = io(state.value.server)
  registerSocketEvents(state.socket)
}

function registerSocketEvents(socket) {
    socket.on("search-results", (results) => {
      state.value.search.searchResults = results.results
    })

    socket.on("connect", () => { joinRoom() })

    socket.on("state", (val) => {
      state.value.queue=val.queue
      state.value.recent=val.recent
    })

    socket.on("register-admin", (response) => {
        state.value.admin = response.success
    })
}

function joinRoom() {
    state.socket.emit("register-web", {"room": state.value.room}, (response) => {
    if(response === true) {
      state.value.joined = true
      router.push({name: "room", params: {room: state.value.room}})
      if (state.value.secret) {
          state.socket.emit("register-admin", {"secret": state.value.secret})
      }
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
    <WelcomeReveal v-if="!state.joined" :room="state.room" :server="state.server" @connect="connect" @update:room="setRoomCode" @update:name="setName" @update:server="setServer" @update:secret="setSecret" />
    <div class="reveal" id="getusername" data-reveal data-close-on-esc="false" data-close-on-click="false" >
     <h1>Please enter your name</h1>
    <label>Name
      <input type="text" @input="(evt) => setCurrentName(evt.target.value)" placeholder="Arno Nym">
    </label>
    <button class="button" @click="() => _append(state.current_entry, state.current_name)">Ok</button>
    <button class="button" @click="append">Abort</button>
    </div>
  </div>
<footer>
Name: <span class="userName" @focusout="(evt) => setName(evt.target.textContent)" contenteditable>{{ state.name }}</span>
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
  min-width: 5em;
	   display: inline-block;
	   height: 70%;
	   text-align: center;

}
</style>
