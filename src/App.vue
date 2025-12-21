<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import { io } from "socket.io-client"
import { useRoute, useRouter } from 'vue-router'
import $ from 'jquery'

import MobileLayout from './components/MobileLayout.vue'
import DesktopLayout from './components/DesktopLayout.vue'
import WelcomeReveal from './components/WelcomeReveal.vue'
import Footer from './components/Footer.vue'
import AlreadyQueued from './components/AlreadyQueued.vue'
import Config from './components/Config.vue'
import ConfigureAppend from './components/ConfigureAppend.vue'

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
    'uid': null,
    'double_entry': {'artist': null, 'title': null, 'reason': null},
    'waiting_room_policy': null,
    'config': {},
    'kiosk': false
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
function update_config(config) {     
    state.socket.emit("update_config", {"config": config})
    close_config()
}
function setKiosk(kiosk) { state.value.kiosk = kiosk }

function search() {
  var yt_checker = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (state.value.search.searchTerm.match(yt_checker)) {
    append({"ident": state.value.search.searchTerm, "source": "youtube"}, true)
    state.value.search.searchTerm = ""
  } else {
    state.value.searching = true
    state.socket.emit("search", {"query": state.value.search.searchTerm })
  }
}

function show_config() {
        state.socket.emit("show_config");
        }

function waitingRoomToQueue(uuid) {
    state.socket.emit("waiting-room-to-queue", {"uuid": uuid})
}

function queueToWaitingRoom(uuid) {
    state.socket.emit("queue-to-waiting-room", {"uuid": uuid})
}

function append(entry, configure) {
    if(configure || state.value.name == "" || state.value.name == null) {
        state.value.current_entry = entry;
        state.value.current_entry.collab_mode = "";
        state.value.current_entry.performer = state.value.name;
        $("#configureAppend").foundation("open");
    } else {
        entry.uid = state.value.uid;
        entry.performer = state.value.name;
        raw_append(entry)
    }
}

function append_configured() {
    if(!state.value.current_entry.performer || state.value.current_entry.performer == "") {
        return;
    }
    $("#configureAppend").foundation("close");
    raw_append(state.value.current_entry);
    state.value.current_entry = null;
}

function append_anyway(entry) {
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.value.double_entry = {'artist': null, 'title': null, 'reason': null};
    state.socket.emit("append-anyway", entry);
    $("#queue-tab-title").click();
}

function raw_append(entry) {
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.value.double_entry = {'artist': null, 'title': null, 'reason': null};
    state.socket.emit("append", entry);
    $("#queue-tab-title").click();
}

function wait_append(entry) {
    $("#alreadyqueued").foundation("close");

    state.socket.emit("waiting-room-append", entry);
    state.value.current_name = null;
    state.value.current_entry = null;
    $("#queue-tab-title").click();
}

function close_config() {
  $("#config").foundation("close")
}
function close_configureAppend() {
    $("#configureAppend").foundation("close");
    state.value.current_entry = null;
    state.value.current_name = null;
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

function moveTo(data) {
    state.socket.emit("move-to", data)
}

function skip(uuid) {
    state.socket.emit("skip", {"uuid": uuid})
}

function registerSocketEvents() {
    state.socket = io(state.value.server, 
        {
            auth: {
                type: "web",
                room: state.value.room,
                secret: state.value.secret,
            }
        }
    )
    state.socket.on("search-results", (results) => {
      state.value.searching = false
      state.value.search.searchResults = results.results
    })

    state.socket.on("disconnect", (reason) => {
        console.warn("Disconnected from server")        
        state.value.joined = false
        state.value.join_msg = "Disconnected from server, please check your connection and try again."
    })
    state.socket.on("connect", () => { joinRoom() })
    state.socket.on("connect_error", (err) => {
        console.warn("Connection error:", err.message);
        state.value.joined = false;        
        state.value.join_msg = "<strong>No such room!</strong> <br/>" + 
            "Please use the correct room code your organizer provided you.<br/>" + 
            "To host your own syng powered karaoke events, please download and " + 
            "install <a href='https://github.com/christofsteel/syng' target='_blank'>Syng</a>"
    })

    state.socket.io.on("reconnect", () => { joinRoom() })
    state.socket.io.on("reconnect_error", () => {
        state.value.joined = false;
    })

    state.socket.on("admin", (is_admin) => {
        console.log("Admin status: " + is_admin)
        state.value.admin = is_admin
        })

    state.socket.on("state", (val) => {
      state.value.queue=val.queue
      state.value.recent=val.recent
      state.value.waiting_room = val.waiting_room
      state.value.waiting_room_policy = val.config.waiting_room_policy
    })

    state.socket.on("config", (response) => {
        state.value.config=response
        $("#config").foundation("open")
    })

    state.socket.on("update_config", (response) => {
        state.value.waiting_room_policy = response["waiting_room_policy"]
    })

    state.socket.on("msg", (response) => {        
        state.value.last_msg = response.msg
        $("#msg").foundation("open")
    })

    state.socket.on("ask_for_waitingroom", (response) => {
        state.value.double_entry = response.old_entry;
        state.value.current_entry = response.current_entry;
        $("#alreadyqueued").foundation("open");
    }) 

    state.socket.on("err", (response) => {    
        switch(response.type) {
        case "QUEUE_FULL":
            var prefix = "The song queue is full and ends at ";
            var date = new Date(response.end_time * 1000).toLocaleString();
            state.value.last_msg = prefix + date;
            break;
        case "JSON_MALFORMED":
            state.value.last_msg = "Malformed JSON in config"
            break;
        case "NO_ADMIN":
            state.value.last_msg = "Forbidden: Not in admin mode"
            break;
        case "PROFANITY":
            state.value.last_msg = "Your name \"" + response.name + "\" may contain profanity, please choose another name!"
            break;
        case "NAME_LENGTH":
            state.value.last_msg = "Your name \"" + response.name + "\" is to long (> 50 Characters), please choose another name!"
            break;
        default:
            state.value.last_msg = "Unknown Error";
            break;
        }
        $("#msg").foundation("open")
    })
}

function joinRoom() {
    console.log("Joining room " + state.value.room)
    localStorage.name = state.value.name
    localStorage.server = state.value.server
    localStorage.room = state.value.room
    localStorage.secret = state.value.secret
    localStorage.uid = state.value.uid
    state.value.joined = true
    router.push({name: "room", params: {room: state.value.room}})
    /* state.socket.emit("register-web", {"room": state.value.room}, (response) => {
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
                "To host your own syng powered karaoke events, please download and " + 
                "install <a href='https://github.com/christofsteel/syng' target='_blank'>Syng</a>"
      state.socket.disconnect()
    }
  }) */
}
</script>

<template>
<div class="page">
  <div class="row" :id="state.kiosk ? 'main-content-kiosk' : 'main-content'">
    <MobileLayout 
        v-show="state.is_small" 
        :state="state" 
        @update:searchTerm="setSearchTerm" 
        @search="search" 
        @append="append" 
        @skip="skip"
        @skipCurrent="skipCurrent"
        @moveUp="moveUp"
        @moveTo="moveTo"
        @waitingRoomToQueue="waitingRoomToQueue"
        @queueToWaitingRoom="queueToWaitingRoom"
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
        @moveTo="moveTo"
        @waitingRoomToQueue="waitingRoomToQueue"
        @queueToWaitingRoom="queueToWaitingRoom"
        />
    <WelcomeReveal
      v-if="!state.joined"
      :room="state.room"
      :server="state.server"
      :joinMsg="state.join_msg"
      :name="state.name"
      :secret="state.secret"
      :kiosk="state.kiosk"
      @connect="connect"
      @update:room="setRoomCode"
      @update:name="setName"
      @update:server="setServer"
      @update:secret="setSecret" 
      @update:kiosk="setKiosk"
      />
    <ConfigureAppend
      :current_name="state.name"
      :current_entry="state.current_entry"
      @update:currentName="setCurrentName"
      @append="append_configured"
      @cancel="close_configureAppend"                
      />
    <AlreadyQueued
      @append="append_anyway"
      @wait="wait_append"
      @cancel="close_already_queued"
      :waiting_room_policy="state.waiting_room_policy"
      :double_entry="state.double_entry"
      :current_entry="state.current_entry"
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
    :admin="state.admin"
    :kiosk="state.kiosk"
    @update:name="setName"
    @logout="emptyLocalStorageAndLogout"
    @config="show_config"
    />
      <Config :config="state.config" @update_config="update_config" @close="close_config"/>
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

#main-content-kiosk {
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
}
</style>
