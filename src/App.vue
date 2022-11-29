<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import { io } from "socket.io-client"
import { useRoute, useRouter } from 'vue-router'
import $ from 'jquery'

import MobileLayout from './components/MobileLayout.vue'
import DesktopLayout from './components/DesktopLayout.vue'
import WelcomeReveal from './components/WelcomeReveal.vue'
import GetUserName from './components/GetUserName.vue'
import Footer from './components/Footer.vue'

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
    'searching': false,
    'last_msg': "",
    'join_msg': undefined
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
  state.value.searching = true
  state.socket.emit("search", {"query": state.value.search.searchTerm })
}

function append(entry) {
  _append(entry, state.value.name) 
  }
function _append(entry, name) {
  if(name == "" || name == undefined) {
    state.value.current_entry = entry
    state.value.current_name = ""
    $("#getusername").foundation("open")
  } else {
      $("#getusername").foundation("close")
      state.value.current_entry = undefined
      state.value.current_name = undefined
      state.socket.emit("append", {"id": entry.id, "performer": name, "source": entry.source })
  }
}

function close_name() {
  $("#getusername").foundation("close")
  state.value.current_entry = undefined
  state.value.current_name = undefined
}

function connect() {
  state.socket = io(state.value.server)
  registerSocketEvents(state.socket)
}

function skipCurrent() {
    state.socket.emit("skip-current")
}

function moveUp(uuid) {
    state.socket.emit("moveUp", {"uuid": uuid})
}

function skip(uuid) {
    state.socket.emit("skip", {"uuid": uuid})
}

function registerSocketEvents(socket) {
    socket.on("search-results", (results) => {
      state.value.searching = false
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

    socket.on("msg", (response) => {        
        state.value.last_msg = response.msg
        $("#msg").foundation("open")
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
      state.value.join_msg = "<strong>No such room!</strong> <br/>" + 
                "Please use the correct room code your organizer provided you.<br/>" + 
                "To host your own syng powered karaoke parties, please download and " + 
                "install <a href='https://git.k-fortytwo.de/christofsteel/syng2.git' " +
                "target='_blank'>Syng</a> and run it with <pre>syng-client " + 
                state.value.server + "</pre>"
    }
  })
}
</script>

<template>
<div class="page">
  <div class="row" id="main-content">
    <MobileLayout 
        v-show="state.is_small" 
        :state="state" 
        @update:searchTerm="setSearchTerm" 
        @search="search" 
        @append="append" 
        @skip="skip"
        @skipCurrent="skipCurrent"
        @moveUp="moveUp"
        />
    <DesktopLayout 
        v-show="!state.is_small" 
        :state="state" 
        @update:searchTerm="setSearchTerm" 
        @search="search" 
        @append="append"
        @skip="skip"
        @skipCurrent="skipCurrent"
        @moveUp="moveUp"
        />
    <WelcomeReveal
      v-if="!state.joined"
      :room="state.room"
      :server="state.server"
      :joinMsg="state.join_msg"
      @connect="connect"
      @update:room="setRoomCode"
      @update:name="setName"
      @update:server="setServer"
      @update:secret="setSecret" 
      />
    <GetUserName
      :current_name="state.current_name"
      :current_entry="state.current_entry"
      @update:currentName="setCurrentName"
      @append="_append(state.current_entry, state.current_name)"
      @close_name="close_name"
      />
    <div class="reveal" id="msg" data-reveal>
      {{ state.last_msg }}
      <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
  <Footer
    :name="state.name"
    @update:name="setName"
    />
</div>
</template>

<style scoped>
.page {
    height:100vh;
    background: url('assets/syng.png') fixed;
    background-color: #8a8a8a;
    background-size: auto 50%;
    background-repeat: no-repeat;
    background-position: center;
}

.page {
    height: 100%;
    position: relative;
}

#main-content {
    height: calc(100vh - 50px);
    max-height: 100vh;
    max-width: 100vw;
}
</style>
