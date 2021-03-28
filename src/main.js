import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import installElement from './plugins/element/installElement.js'
import Notifications from 'vue-notification'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.css'
import '@mdi/font/css/materialdesignicons.css'


Vue.config.productionTip = false
Vue.use(installElement)
Vue.use(Notifications)

new Vue({
  render: h => h(App),
  vuetify,
}).$mount('#app')
