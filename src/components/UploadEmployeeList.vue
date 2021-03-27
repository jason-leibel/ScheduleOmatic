<template>
  <v-card
      class="mx-auto"
      tile
      style="width: 80%; padding: 20px; margin: 20px auto;"
  >
    <v-expansion-panels accordion>
      <v-expansion-panel
          v-for="(item,i) in 1"
          :key="i"
      >
        <v-expansion-panel-header>Upload Employee List</v-expansion-panel-header>
        <v-expansion-panel-content>
          <h1>Upload Employee List:</h1>

          <v-file-input
              v-model="file"
              accept="*.json"
              label="File input"
              on
          ></v-file-input>

          <v-btn
              color="primary"
              class="mr-4"
              @click="uploadFile"
          >
            Upload to List
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  name: "UploadEmployeeList",
  props: [
    "employeeList"
  ],
  data() {
    return {
      file: null,
    }
  },
  methods: {
    uploadFile() {
      let reader = new FileReader();
      reader.readAsText(this.file, "UTF-8");
      reader.onload = evt => {
        this.$emit("updateEmployeeList", JSON.parse(evt.target.result))
        this.$emit("notification", "Success", "success", "File uploaded successfully")
      }
      reader.onerror = evt => {
        this.$emit("notification", "Error", "error", "No file uploaded")
      }
    }
  }
}
</script>

<style scoped>

</style>