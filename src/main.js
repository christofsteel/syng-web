import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import jquery from 'jquery'
import Foundation from 'foundation-sites'
import App from './App.vue'
import Main from './Main.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faList, faArrowUp, faHistory, faPlus, faStepForward, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'

import 'foundation-sites/dist/css/foundation.min.css'
import './assets/main.css'
library.add(faMagnifyingGlass)
library.add(faList)
library.add(faPlus)
library.add(faHistory)
library.add(faStepForward)
library.add(faYoutube)
library.add(faTimes)
library.add(faArrowUp)

window.jQuery = jquery;
window.$ = jquery;

Foundation.addToJquery($)

const routes = [
  { path: '/:room/', name: 'room', component: App},
  { path: '/', component: App}
]

const router = createRouter({
  history: createWebHistory(),
  routes}
)

app = createApp(Main)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
