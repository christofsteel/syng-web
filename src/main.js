import { createApp } from 'vue'
import $ from 'jquery'
import Foundation from 'foundation-sites'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faList, faHistory, faPlus, faStepForward, faTimes } from '@fortawesome/free-solid-svg-icons'
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

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')

$(document).foundation();
