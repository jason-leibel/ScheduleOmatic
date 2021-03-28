<template>
  <v-expansion-panels style="width: 80%; margin: 10px auto" accordion>
    <v-expansion-panel
        v-for="(item,i) in 1"
        :key="i"
    >
      <v-expansion-panel-header><h1>Upload Employee List File</h1></v-expansion-panel-header>
      <v-expansion-panel-content>

          <v-file-input
              v-model="file"
              accept="*.json"
              label="File input"
              on
          ></v-file-input>

          <v-btn
              color="primary"
              class="mr-4"
              :disabled="file === null"
              @click="uploadFile"
          >
            Upload to List
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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