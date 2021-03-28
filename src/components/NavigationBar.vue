<template>
  <div>
    <v-app-bar
        color="#e61f23"
        dense
    >
      <v-toolbar-title class="NavigationBar__title">Schedule O Matic!</v-toolbar-title>
    </v-app-bar>
    <v-spacer style="background-color: #7a1127; width: 100%; height: 10px" />
    <v-spacer style="background-color: #7ae0d6; width: 100%; height: 10px" />
  </div>
</template>

<script>
export default {
  name: "NavigationBar"
}
</script>

<style>
  .NavigationBar__title {
    font-family: "Roboto", sans-serif;
    font-size: 32px;
    color: white;
  }
</style>
