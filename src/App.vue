<script setup>
import { computed, ref, onMounted, onDeactivated } from 'vue'
import { io } from "socket.io-client"

import MobileLayout from './components/MobileLayout.vue'
import DesktopLayout from './components/DesktopLayout.vue'

onMounted(() => {
  window.addEventListener("resize", resizeBrowserHandler)
})

function resizeBrowserHandler (e) {
    is_small.value = (e.target.innerWidth < 768)
}

const is_small = ref(window.innerWidth < 768)
const state = ref({
'search': {'searchTerm': '', 'searchResults': []},
'queue': [ 
{'artist': 'Artist A', 'title': 'Songname A', 'album': 'Album A', 'performer': "Performer A"} ,
{'artist': 'Artist B', 'title': 'Songname B', 'album': 'Album B', 'performer': "Performer B"} ,
{'artist': 'Artist C', 'title': 'Songname C', 'album': 'Album C', 'performer': "Performer C"} ,
]
})


function updateSearchTerm(val) {
state.value.search.searchTerm = val
}

const socket = io("ws://localhost:8080")

function search() {
  socket.emit("search", {"query": state.value.search.searchTerm })
}

socket.on("search-results", (results) => {
  state.value.search.searchResults = results
})

socket.on("connect", () =>
  { socket.emit("register-web", {"room": "ABCD"}) }
  )

socket.on("state", (val) => {
  console.log(val)
})

</script>

<template>
<div class="page">
    <div class="row" id="main-content">
      <MobileLayout v-show="is_small" :state="state" @update:searchTerm="updateSearchTerm" />
      <DesktopLayout v-show="!is_small" :state="state" @update:searchTerm="updateSearchTerm" @search="search"/>
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
