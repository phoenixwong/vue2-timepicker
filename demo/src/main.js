import Vue from 'vue'

import VueHighlightJS from 'vue-highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import vue from 'vue-highlight.js/lib/languages/vue'
import 'highlight.js/styles/docco.css'

import App from './App.vue'

Vue.config.productionTip = false

/*
* Use Vue Highlight.js
*/
Vue.use(VueHighlightJS, {
  // Register only languages that you want
  languages: {
    javascript,
    json,
    vue
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
