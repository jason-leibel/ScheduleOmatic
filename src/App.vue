<template>
  <v-app id="app">
    <Navigation/>
    <AddEmployee @addEmployee="addEmployee" @notification="sendNotification"/>
    <UploadEmployeeList @updateEmployeeList="updateEmployeeList"/>
    <EmployeeList :employee-list="liveEmployeeList" @generateSchedule="generateSchedule"
                  @notification="sendNotification"/>
    <notifications group="app" position="bottom left"/>
    <ScheduleView :employee-list="liveEmployeeList" ref="scheduleView" />
  </v-app>
</template>

<script>
import Navigation from "./components/NavigationBar.vue";
import AddEmployee from "./components/AddEmployee.vue";
import EmployeeList from "./components/EmployeeList.vue";
import UploadEmployeeList from "./components/UploadEmployeeList.vue";

import 'vuetify/dist/vuetify.css'
import ScheduleView from "@/components/ScheduleView";

export default {
  name: "app",
  components: {
    ScheduleView,
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
      this.$notify({
        group: 'app',
        title,
        type,
        duration: 6000,
        text
      });
    },
    generateSchedule(list) {
      this.$refs.scheduleView.generateSchedule(list)
    }
  },
  computed: {
    liveEmployeeList() {
      return this.employeeList
    }
  },
  data() {
    return {
      employeeList: [{"employeeName":"Post Office Employee 1","employeeAvailability":{"sunday":{"startTime":12,"endTime":17},"wednesday":{"startTime":12,"endTime":17},"thursday":{"startTime":12,"endTime":17},"friday":{"startTime":12,"endTime":17},"saturday":{"startTime":12,"endTime":17},"totalHoursAvailable":25},"employeeHoursToWork":"35","employeeDepartment":"Post Office"},{"employeeName":"Post Office Employee 2","employeeAvailability":{"sunday":{"startTime":12,"endTime":22},"monday":{"startTime":12,"endTime":22},"tuesday":{"startTime":12,"endTime":22},"wednesday":{"startTime":12,"endTime":22},"thursday":{"startTime":12,"endTime":22},"totalHoursAvailable":50},"employeeHoursToWork":"30","employeeDepartment":"Post Office"},{"employeeName":"Post Office Employee 3","employeeAvailability":{"sunday":{"startTime":8,"endTime":22},"monday":{"startTime":16.5,"endTime":22},"wednesday":{"startTime":16.5,"endTime":22},"thursday":{"startTime":16.5,"endTime":22},"friday":{"startTime":16.5,"endTime":22},"saturday":{"startTime":8,"endTime":22},"totalHoursAvailable":50},"employeeHoursToWork":"20","employeeDepartment":"Post Office"},{"employeeName":"Post Office Employee 4","employeeAvailability":{"monday":{"startTime":8,"endTime":21.5},"tuesday":{"startTime":8,"endTime":21.5},"wednesday":{"startTime":8,"endTime":21.5},"thursday":{"startTime":8,"endTime":21.5},"saturday":{"startTime":8,"endTime":21.5},"totalHoursAvailable":67.5},"employeeHoursToWork":"40","employeeDepartment":"Post Office"},{"employeeName":"Post Office Employee 5","employeeAvailability":{"monday":{"startTime":8.5,"endTime":16},"tuesday":{"startTime":8.5,"endTime":16},"wednesday":{"startTime":8.5,"endTime":16},"thursday":{"startTime":8.5,"endTime":16},"friday":{"startTime":8.5,"endTime":16},"totalHoursAvailable":37.5},"employeeHoursToWork":"40","employeeDepartment":"Post Office"},{"employeeName":"Automotive Parts Employee 1","employeeAvailability":{"sunday":{"startTime":1,"endTime":23.5},"monday":{"startTime":1,"endTime":23.5},"tuesday":{"startTime":1,"endTime":23.5},"wednesday":{"startTime":1,"endTime":23.5},"thursday":{"startTime":1,"endTime":23.5},"friday":{"startTime":1,"endTime":23.5},"saturday":{"startTime":1,"endTime":23.5},"totalHoursAvailable":157.5},"employeeHoursToWork":"40","employeeDepartment":"Automotive Parts"},{"employeeName":"Automotive Parts Employee 2","employeeAvailability":{"sunday":{"startTime":1,"endTime":23.5},"monday":{"startTime":1,"endTime":23.5},"tuesday":{"startTime":1,"endTime":23.5},"wednesday":{"startTime":1,"endTime":23.5},"thursday":{"startTime":1,"endTime":23.5},"friday":{"startTime":1,"endTime":23.5},"saturday":{"startTime":1,"endTime":23.5},"totalHoursAvailable":157.5},"employeeHoursToWork":"40","employeeDepartment":"Automotive Parts"},{"employeeName":"Automotive Parts Employee 3","employeeAvailability":{"sunday":{"startTime":1,"endTime":23.5},"monday":{"startTime":1,"endTime":23.5},"tuesday":{"startTime":1,"endTime":23.5},"wednesday":{"startTime":1,"endTime":23.5},"thursday":{"startTime":1,"endTime":23.5},"friday":{"startTime":1,"endTime":23.5},"saturday":{"startTime":1,"endTime":23.5},"totalHoursAvailable":157.5},"employeeHoursToWork":"40","employeeDepartment":"Automotive Parts"},{"employeeName":"Customer Service Employee 1","employeeAvailability":{"sunday":{"startTime":1,"endTime":23.5},"monday":{"startTime":1,"endTime":23.5},"tuesday":{"startTime":1,"endTime":23.5},"wednesday":{"startTime":1,"endTime":23.5},"thursday":{"startTime":1,"endTime":23.5},"friday":{"startTime":1,"endTime":23.5},"saturday":{"startTime":1,"endTime":23.5},"totalHoursAvailable":157.5},"employeeHoursToWork":"40","employeeDepartment":"Customer Service"},{"employeeName":"Customer Service Employee 2","employeeAvailability":{"sunday":{"startTime":1,"endTime":23.5},"monday":{"startTime":1,"endTime":23.5},"tuesday":{"startTime":1,"endTime":23.5},"wednesday":{"startTime":1,"endTime":23.5},"thursday":{"startTime":1,"endTime":23.5},"friday":{"startTime":1,"endTime":23.5},"saturday":{"startTime":1,"endTime":23.5},"totalHoursAvailable":157.5},"employeeHoursToWork":"40","employeeDepartment":"Customer Service"},{"employeeName":"Customer Service Employee 3","employeeAvailability":{"sunday":{"startTime":1,"endTime":23.5},"monday":{"startTime":1,"endTime":23.5},"tuesday":{"startTime":1,"endTime":23.5},"wednesday":{"startTime":1,"endTime":23.5},"thursday":{"startTime":1,"endTime":23.5},"friday":{"startTime":1,"endTime":23.5},"saturday":{"startTime":1,"endTime":23.5},"totalHoursAvailable":157.5},"employeeHoursToWork":"40","employeeDepartment":"Customer Service"}]
    }
  },
};
</script>

<style>
#app {
  font-family: "Roboto", sans-serif !important;
}

.v-data-table-header {
  background-color: #e6e6e6;
}
</style>
