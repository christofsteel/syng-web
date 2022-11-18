import { createApp } from 'vue'
import $ from 'jquery'
import Foundation from 'foundation-sites'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faList, faHistory } from '@fortawesome/free-solid-svg-icons'

import './assets/main.css'
import 'foundation-sites/dist/css/foundation.min.css'

library.add(faMagnifyingGlass)
library.add(faList)
library.add(faHistory)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')

$(document).foundation();
