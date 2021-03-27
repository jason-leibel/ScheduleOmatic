<template>
  <div>
    <v-app-bar
        color="#62ae82"
        dense
    >
      <v-toolbar-title class="NavigationBar__title">Schedule O Matic!</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "NavigationBar"
}
</script>

<style scoped>
  .NavigationBar__title {
    font-family: "Roboto", sans-serif;
    font-size: 32px;
    color: white;
  }
</style>
