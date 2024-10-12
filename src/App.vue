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
import Config from './components/Config.vue'

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
    'last_notification_uuid': null,
    'searching': false,
    'last_msg': "",
    'join_msg': null,
    'uid': null,
    'double_entry': {'artist': null, 'title': null, 'reason': null},
    'waiting_room_policy': null,
    'notify_me': [],
    'config': {}
})

onMounted(() => { 
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(
        p => {
          if (p !== 'granted') {
             console.log('User blocked notifications.');
          }
        }
      ).catch(err => console.error(err))
    }
    }
  window.addEventListener("resize", (e) => { state.value.is_small = (e.target.innerWidth < 768) });
  $(document).foundation();
  if(localStorage.name && localStorage.name != "null"){ state.value.name = localStorage.name }
  if(localStorage.server){ state.value.server = localStorage.server }
  if(!(state.value.room)) {
      if(localStorage.room){ state.value.room = localStorage.room }
  }
  if(localStorage.secret){ state.value.secret = localStorage.secret }
  if(localStorage.uid){ state.value.uid = localStorage.uid }
  if(localStorage.notify_me) { state.value.notify_me = JSON.parse(localStorage.notify_me); }
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
    state.value.socket.disconnect()
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
    state.value.socket.emit("update_config", {"config": config})
    close_config()
}

function search() {
  var yt_checker = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (state.value.search.searchTerm.match(yt_checker)) {
    append({"ident": state.value.search.searchTerm, "source": "youtube"})
  } else {
    state.value.searching = true
    state.value.socket.emit("search", {"query": state.value.search.searchTerm })
  }
}

function show_config() {
        state.value.socket.emit("show_config");
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
        raw_append(entry.ident, name, entry.source, state.value.uid);
    }
}

function append_anyway(ident, name, source, uid) {
    $("#getusername").foundation("close");
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.value.double_entry = {'artist': null, 'title': null, 'reason': null};
    state.value.socket.emit("append-anyway", {"ident": ident, "performer": name, "source": source, "uid": uid });
    $("#queue-tab-title").click();
}

function raw_append(ident, name, source, uid) {
    $("#getusername").foundation("close");
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.value.double_entry = {'artist': null, 'title': null, 'reason': null};
    state.value.socket.emit("append", {"ident": ident, "performer": name, "source": source, "uid": uid });
    $("#queue-tab-title").click();
}

function wait_append(ident, name, source, uid) {
    $("#getusername").foundation("close");
    $("#alreadyqueued").foundation("close");

    state.value.current_name = null;
    state.value.current_entry = null;
    state.value.socket.emit("waiting-room-append", {"ident": ident, "performer": name, "source": source, "uid": uid });
    $("#queue-tab-title").click();
}

function close_name() {
  $("#getusername").foundation("close")
  state.value.current_entry = null
  state.value.current_name = null
}
function close_config() {
  $("#config").foundation("close")
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
  registerSocketEvents(state.value.socket)
}

function notify_disable(uuid) {
    let notify_me = JSON.parse(localStorage.notify_me)
    let idx = notify_me.indexOf(uuid);
    notify_me.splice(idx, 1);
    localStorage.setItem("notify_me", JSON.stringify(notify_me))
    state.value.notify_me = notify_me
}

function notify_enable(uuid) {
    let notify_me = JSON.parse(localStorage.notify_me)
    notify_me.push(uuid)
    localStorage.setItem("notify_me", JSON.stringify(notify_me))
    state.value.notify_me = notify_me
}

function registerSocketEvents() {
    state.value.socket = io(state.value.server)
    state.value.socket.on("search-results", (results) => {
      state.value.searching = false
      state.value.search.searchResults = results.results
    })

    state.value.socket.on("connect", () => { joinRoom() })

    state.value.socket.io.on("reconnect", () => { joinRoom() })

    state.value.socket.on("state", (val) => {
    if(!localStorage.notify_me) {
      localStorage.setItem("notify_me", "[]");
      state.value.notify_me = []
    }

    var new_notify = [] // Somehow Array.filter does not work
    state.value.notify_me.forEach((uuid) => {
        for(const entry of val.queue) {
            if(entry.uuid === uuid) {
                new_notify.push(uuid)
            };
        };
    });
    state.value.notify_me = new_notify;

    localStorage.setItem("notify_me", JSON.stringify(state.value.notify_me))

      if (val.queue.length > 1 && 
           val.queue[1].uuid != state.value.last_notification_uuid &&
           state.value.notify_me.indexOf(val.queue[1].uuid) !== -1 &&
         Notification.permission === 'granted') {
         state.value.last_notification_uuid = val.queue[1].uuid;
        new Notification("Next Up for " + val.queue[1].performer + ":", {body: val.queue[1].artist + " - " + val.queue[1].title})
      }
      state.value.queue=val.queue
      state.value.recent=val.recent
      state.value.waiting_room = val.waiting_room
      state.value.waiting_room_policy = val.config.waiting_room_policy
    })

    state.value.socket.on("config", (response) => {
        state.value.config=response
        $("#config").foundation("open")
    })

    state.value.socket.on("update_config", (response) => {
        console.log(response)
        state.value.waiting_room_policy = response["waiting_room_policy"]
        console.log(state)
    })

    state.value.socket.on("msg", (response) => {        
        state.value.last_msg = response.msg
        $("#msg").foundation("open")
    })

    state.value.socket.on("ask_for_waitingroom", (response) => {
        state.value.double_entry = response.old_entry;
        state.value.current_entry = response.current_entry;
        $("#alreadyqueued").foundation("open");
    }) 

    state.value.socket.on("err", (response) => {    
        console.log(response)
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
    state.value.socket.emit("register-web", {"room": state.value.room}, (response) => {
    if(response === true) {
      localStorage.name = state.value.name
      localStorage.server = state.value.server
      localStorage.room = state.value.room
      localStorage.secret = state.value.secret
      localStorage.uid = state.value.uid
      state.value.joined = true
      router.push({name: "room", params: {room: state.value.room}})
      if (state.value.secret) {
          state.value.socket.emit("register-admin", {"secret": state.value.secret}, (response) => {
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
            state.value.socket.disconnect()
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
        @notify_disable="notify_disable"
        @notify_enable="notify_enable"
        />
    <DesktopLayout 
        v-show="!state.is_small" 
        :state="state" 
        @update:searchTerm="setSearchTerm" 
        @search="search" 
        @append="append"
        @notify_disable="notify_disable"
        @notify_enable="notify_enable"
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
      @append="append_anyway(state.current_entry.ident, state.name ? state.name : state.current_name, state.current_entry.source, state.uid)"
      @wait="(uid) => wait_append(state.current_entry.ident, state.name ? state.name : state.current_name, state.current_entry.source, null)"
      @cancel="close_already_queued"
      :waiting_room_policy="state.waiting_room_policy"
      :double_entry="state.double_entry"
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
    :show_name="state.show_name"
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
</style>
