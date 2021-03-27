<template>
  <v-app>
    <Navigation :is-signed-in="isSignedIn" @signIn="signIn" @signOut="signOut"/>
    <AddPidFilter :is-signed-in="isSignedIn" :auth-instance="authInstance"/>
    <notifications group="app" position="bottom left"/>
    <Instructions />
  </v-app>
</template>

<script>
import Vue from 'vue'
import AddPidFilter from "./components/AddPidFilter.vue";
import Navigation from "./components/NavigationBar.vue";
import Instructions from "./components/Instructions.vue";

import 'vuetify/dist/vuetify.css'
import VueGapi from 'vue-gapi'

Vue.use(VueGapi, {
  apiKey: 'AIzaSyA8aWGNiYwZUY8ArkeHy6V98QkqAJ1f2aA',
  clientId: '243568982452-6tqtb521vek7929r7uj54lh2tt7i2ol8.apps.googleusercontent.com',
  discoveryDocs: ['https://gmail.googleapis.com/$discovery/rest?version=v1'],
  scope: "https://mail.google.com/ https://www.googleapis.com/auth/gmail.settings.basic",
})

export default {
  name: "app",
  components: {
    Navigation,
    Instructions,
    AddPidFilter
  },
  data() {
    return {
      auth: null
    }
  },
  mounted() {
    this.signIn()
  },
  computed: {
    authInstance() {
      return this.auth
    },
    isSignedIn() {
      return this.authInstance !== null
    }
  },
  methods: {
    signIn() {
      this.$gapi.login().then(data => {
        this.auth = data
      })
    },
    signOut() {
      this.$gapi.logout().then(() => {
        this.auth = null
      })
    }
  }
};
</script>

<style>
#app {
  font-family: "Roboto", sans-serif !important;
}
</style>
