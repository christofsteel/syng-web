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
import AlreadyQueued from './components/AlreadyQueued.vue'

const router = useRouter()

const state = ref({
    'search': {'searchTerm': '', 'searchResults': []},
    'queue': [ ],
    'waiting_room': [ ],
    'room': useRoute().params.room,
    'name': null,
    'joined': false,
    'server': window.location.protocol + "//" + window.location.host + "/",
    'socket': null, 
    'is_small': window.innerWidth < 768,
    'admin': false,
    'secret': null,
    'current_entry': null,
    'current_name': null,
    'searching': false,
    'last_msg': "",
    'join_msg': null,
    'uid': null
})

onMounted(() => { 
  window.addEventListener("resize", (e) => { state.value.is_small = (e.target.innerWidth < 768) });
  $(document).foundation();
  if(localStorage.name && localStorage.name != "null"){ state.value.name = localStorage.name }
  if(localStorage.server){ state.value.server = localStorage.server }
  if(!(state.value.room)) {
      if(localStorage.room){ state.value.room = localStorage.room }
  }
  if(localStorage.secret){ state.value.secret = localStorage.secret }
  if(localStorage.uid){ state.value.uid = localStorage.uid }
  if(state.value.server && state.value.room && state.value.name) {
    connect()
  }
})

function emptyLocalStorageAndLogout() {
    localStorage.removeItem('server')
    localStorage.removeItem('secret')
    localStorage.removeItem('name')
    localStorage.removeItem('room')
    localStorage.removeItem('uid')
    state.socket.disconnect()
    state.value.joined = false
}

function setRoomCode(room) { state.value.room = room; }
function setSecret(secret) { state.value.secret = secret; }
function setName(name) { state.value.name = name; localStorage.name=name }
function setCurrentName(name) { state.value.current_name = name }
function updateName(evt) { evt.target.textContent = state.value.name;}
function setServer(server) { state.value.server = server }
function setSearchTerm(searchTerm) { state.value.search.searchTerm = searchTerm }

function search() {
  var yt_checker = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (state.value.search.searchTerm.match(yt_checker)) {
    append({"ident": state.value.search.searchTerm, "source": "youtube"})
  } else {
    state.value.searching = true
    state.socket.emit("search", {"query": state.value.search.searchTerm })
  }
}

function append(entry) {
    checked_append_with_name(entry, state.value.name) 
}
function checked_append_with_name(entry, name) {
    if(name == "" || name == null) {
        state.value.current_entry = entry;
        state.value.current_name = "";
        $("#getusername").foundation("open");
    } else {
        $("#getusername").foundation("close");

        var in_queue = false;
        for (const entry of state.value.queue) {
            if(entry.uid == state.value.uid) { 
                in_queue = true;
            }
        }

        if(in_queue && !state.value.admin) {
            state.value.current_entry = entry;
            $("#alreadyqueued").foundation("open");
        } else {
            raw_append(entry.ident, name, entry.source, state.value.uid);
        }
    }
}

function raw_append(ident, name, source, uid) {
    $("#getusername").foundation("close");
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.socket.emit("append", {"ident": ident, "performer": name, "source": source, "uid": uid });
    $("#queue-tab-title").click();
}

function wait_append(ident, name, source, uid) {
    $("#getusername").foundation("close");
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.socket.emit("waiting-room-append", {"ident": ident, "performer": name, "source": source, "uid": uid });
    $("#queue-tab-title").click();
}

function close_name() {
  $("#getusername").foundation("close")
  state.value.current_entry = null
  state.value.current_name = null
}

function close_already_queued() {
    $("#alreadyqueued").foundation("close");
    state.value.current_entry = null;
    state.value.current_name = null;
}

function connect() {
  if(!state.value.uid || state.value.uid == "null") {
    if(isSecureContext) {
    state.value.uid = crypto.randomUUID();
    } else {
        console.log("Insecure connection detected, user ids may not be unique");
        state.value.uid = Math.random();
    }
  }
  registerSocketEvents(state.socket)
}

function skipCurrent() {
    state.socket.emit("skip-current")
}

function moveUp(uuid) {
    state.socket.emit("move-up", {"uuid": uuid})
}

function skip(uuid) {
    state.socket.emit("skip", {"uuid": uuid})
}

function registerSocketEvents() {
    state.socket = io(state.value.server)
    state.socket.on("search-results", (results) => {
      state.value.searching = false
      state.value.search.searchResults = results.results
    })

    state.socket.on("connect", () => { joinRoom() })

    state.socket.io.on("reconnect", () => { joinRoom() })

    state.socket.on("state", (val) => {
      state.value.queue=val.queue
      state.value.recent=val.recent
      state.value.waiting_room = val.waiting_room
    })

    state.socket.on("msg", (response) => {        
        state.value.last_msg = response.msg
        $("#msg").foundation("open")
    })
}

function joinRoom() {
    console.log("Joining room " + state.value.room)
    state.socket.emit("register-web", {"room": state.value.room}, (response) => {
    if(response === true) {
      localStorage.name = state.value.name
      localStorage.server = state.value.server
      localStorage.room = state.value.room
      localStorage.secret = state.value.secret
      localStorage.uid = state.value.uid
      state.value.joined = true
      router.push({name: "room", params: {room: state.value.room}})
      if (state.value.secret) {
          state.socket.emit("register-admin", {"secret": state.value.secret}, (response) => {
            state.value.admin = response
          })
      }
    } else {
      state.value.join_msg = "<strong>No such room!</strong> <br/>" + 
                "Please use the correct room code your organizer provided you.<br/>" + 
                "To host your own syng powered karaoke parties, please download and " + 
                "install <a href='https://git.k-fortytwo.de/christofsteel/syng2.git' " +
                "target='_blank'>Syng</a> and run it with <pre>syng-client " + 
                state.value.server + "</pre>"
        if(state.value.joined) {
            state.socket.disconnect()
            setTimeout(() => connect(), 2000)
        }
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
      :name="state.name"
      :secret="state.secret"
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
      @append="checked_append_with_name(state.current_entry, state.current_name)"
      @close_name="close_name"
      />
    <AlreadyQueued
      @append="raw_append(state.current_entry.ident, state.name ? state.name : state.current_name, state.current_entry.source, state.uid)"
      @wait="wait_append(state.current_entry.ident, state.name ? state.name : state.current_name, state.current_entry.source, state.uid)"
      @cancel="close_already_queued"
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
    @logout="emptyLocalStorageAndLogout"
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
