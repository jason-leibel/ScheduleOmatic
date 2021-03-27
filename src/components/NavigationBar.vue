<template>
  <div>
    <v-app-bar
        color="#62ae82"
        dense
    >
      <v-toolbar-title class="NavigationBar__title">GMail Filter Assistant</v-toolbar-title>
      <v-spacer/>
      <v-btn
          v-if="isSignedIn"
          large
          color="success"
          style="background-color: #62ae82 !important;"
          @click="signOut">Sign Out
      </v-btn>
      <v-btn
          v-else
          large
          style="background-color: #62ae82 !important;"
          @click="signIn">Sign In
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
  props: [
      "isSignedIn"
  ],
  methods: {
    signIn() {
      this.$emit("signIn")
    },
    signOut() {
      this.$emit("signOut")
    }
  },
  computed: {
    signedIn() {
      return this.isSignedIn
    }
  }
}
</script>

<style scoped>
  .NavigationBar__title {
    font-family: "Roboto", sans-serif;
    font-size: 32px;
    color: white;
  }
</style>
