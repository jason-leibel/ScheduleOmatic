<template>
  <v-app>
    <Navigation/>
    <AddEmployee @addEmployee="addEmployee" @notification="sendNotification" />
    <UploadEmployeeList @updateEmployeeList="updateEmployeeList" />
    <EmployeeList :employee-list="liveEmployeeList" @notification="sendNotification" />
    <notifications group="app" position="bottom left"/>
  </v-app>
</template>

<script>
import Navigation from "./components/NavigationBar.vue";
import AddEmployee from "./components/AddEmployee.vue";
import EmployeeList from "./components/EmployeeList.vue";
import UploadEmployeeList from "./components/UploadEmployeeList.vue";

import 'vuetify/dist/vuetify.css'

export default {
  name: "app",
  components: {
    Navigation,
    AddEmployee,
    EmployeeList,
    UploadEmployeeList
  },
  methods: {
    updateEmployeeList(employees) {
      this.employeeList = employees
    },
    addEmployee(employee) {
      if (!this.employeeList) {
        this.employeeList = []
      }
      this.employeeList.push(employee)
    },
    sendNotification(title, type, text) {
      console.log("Notification")
      this.$notify({
        group: 'app',
        title,
        type,
        duration: 4000,
        text
      });
    }
  },
  computed: {
    liveEmployeeList() {
      return this.employeeList
    }
  },
  data() {
    return {
      employeeList: []
    }
  },
};
</script>

<style>
#app {
  font-family: "Roboto", sans-serif !important;
}
</style>
