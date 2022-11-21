<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import $ from 'jquery'
import { io } from "socket.io-client"
import { useRoute, useRouter } from 'vue-router'

import MobileLayout from './components/MobileLayout.vue'
import DesktopLayout from './components/DesktopLayout.vue'

const router=useRouter()

function resizeBrowserHandler (e) {
    is_small.value = (e.target.innerWidth < 768)
}

const is_small = ref(window.innerWidth < 768)
const state = ref({
'search': {'searchTerm': '', 'searchResults': []},
'queue': [ ],
'roomCode': undefined,
'name': undefined
})

onMounted(() => {
  window.addEventListener("resize", resizeBrowserHandler)
  $(document).foundation();
  $("#welcome").foundation("open")
  if(useRoute().params.room) {
    state.value.roomCode = useRoute().params.room
    closeWelcome()
  }
})

function setRoomCode(roomEvent) {
state.value.roomCode = roomEvent.target.value
}

function setName(nameEvent) {
state.value.name = nameEvent.target.value
}

function updateSearchTerm(val) {
state.value.search.searchTerm = val
}

const socket = io("ws://localhost:8080")

function search() {
  socket.emit("search", {"query": state.value.search.searchTerm })
}

function append(entry) {
  socket.emit("append", {"id": entry.id, "performer": state.value.name, "source": entry.source })
}

function closeWelcome() {
  if(state.value.roomCode != undefined) {
    socket.emit("register-web", {"room": state.value.roomCode}, (response) => {
    if(response === true) {
      $('#welcome').foundation("close")
      router.push({name: "room", params: {room: state.value.roomCode}})
    } else {
      console.log("no such room")
    }
   }) 
  }
}

socket.on("search-results", (results) => {
  state.value.search.searchResults = results
})

socket.on("connect", () =>
  { socket.emit("register-web", {"room": "ABCD"}) }
  )

socket.on("state", (val) => {
  state.value.queue=val
})
</script>

<script>
</script>

<template>
<div class="page">
    <div class="row" id="main-content">
      <MobileLayout v-show="is_small" :state="state" @update:searchTerm="updateSearchTerm" />
      <DesktopLayout v-show="!is_small" :state="state" @update:searchTerm="updateSearchTerm" @search="search" @append="append" />
      <div class="reveal" id="welcome" data-reveal data-close-on-click="false">
      <h1>Welcome to Syng</h1>
      <p>
        Please enter the room code and your name
      </p>
      
        <div class="grid-container">
          <div class="grid-x grid-padding-x">
            <div class="medium-6 cell">
              <label>Room code
                <input type="text" @input="setRoomCode" placeholder="XXXX">
              </label>
            </div>
            <div class="medium-6 cell">
              <label>Name
                <input type="text" @input="setName" placeholder="Leave empty to be asked on append">
              </label>
            </div>
          </div>
        </div>
        <button class="button" @click="closeWelcome" >Connect</button>
      <button class="close-button" data-close aria-label="Close reveal" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
    </div>
  </div>
  <router-view></router-view>
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
