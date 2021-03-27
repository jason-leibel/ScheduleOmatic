<template>
  <v-app id="app">
    <Navigation/>
    <AddEmployee @addEmployee="addEmployee" @notification="sendNotification"/>
    <UploadEmployeeList @updateEmployeeList="updateEmployeeList"/>
    <EmployeeList :employee-list="liveEmployeeList" @generateSchedule="generateSchedule"
                  @notification="sendNotification"/>
    <notifications group="app" position="bottom left"/>
    <v-card
        class="mx-auto"
        tile
        style="width: 95%; padding: 1 0px; margin: 20px auto;"
    >
      <v-data-table
          :headers="scheduleHeaders"
          :items="scheduleObj"
          :items-per-page="10"/>
    </v-card>
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
        duration: 6000,
        text
      });
    },
    generateSchedule(list) {
      let postOffice = this.timeObj.departments.filter(department => department.name === "Post Office")[0]
      let workersPO = list.filter(person => person.employeeDepartment === "Post Office")
      this.scheduleObj = []
      let scheduleObj = {}

      postOffice.timeFrames.forEach(tf => {
        scheduleObj[tf.day] = {}
        workersPO.forEach(wrk => {
          if (wrk.employeeAvailability[tf.day] !== undefined) {
            scheduleObj[tf.day][wrk.employeeName] = {}
            scheduleObj[tf.day][wrk.employeeName].available = true
            let empStartTime = wrk.employeeAvailability[tf.day].startTime
            let empEndTime = wrk.employeeAvailability[tf.day].endTime
            // If the employee is available before or at shift open
            if (wrk.employeeAvailability[tf.day].startTime <= tf.open) {
              // schedule employee to work from open eiter until 8 hours or they become unavailable
              scheduleObj[tf.day][wrk.employeeName].startTime = tf.open
              let hoursAvail = empEndTime - empStartTime
              scheduleObj[tf.day][wrk.employeeName].endTime = (
                  hoursAvail < 8
              ) ? tf.open + hoursAvail : ((tf.open + 8) > tf.close) ? tf.close : tf.open + 8

            } else {
              // schedule employee to work from their time available either until close or 8 hours later
              scheduleObj[tf.day][wrk.employeeName].startTime = wrk.employeeAvailability[tf.day].startTime
              let hoursAvail = empEndTime - empStartTime
              scheduleObj[tf.day][wrk.employeeName].endTime = ((hoursAvail + empStartTime) > tf.close) ? tf.close :
                  (hoursAvail + empStartTime)
            }
          } else {
            // Employee unavailable that day
            scheduleObj[tf.day][wrk.employeeName] = {}
            scheduleObj[tf.day][wrk.employeeName].available = false
          }
        })
      })
      this.translateToTable(scheduleObj)
    },
    translateToTable(obj) {
      let result = []
      obj = this.filterOutPeople(obj)
      let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      this.employeeList.forEach(employee => {
        let temp = {}
        temp["name"] = employee.employeeName
        temp["department"] = employee.employeeDepartment
        temp["totalTimeThisWeek"] = 0
        temp["schedule"] = {}
        days.forEach(day => {
          if (obj[day][employee.employeeName] !== undefined) {
            temp["totalTimeThisWeek"] += obj[day][employee.employeeName].endTime - obj[day][employee.employeeName].startTime
            temp["schedule"][day] = (obj[day][employee.employeeName].available) ?
                this.doubleToTimeString(obj[day][employee.employeeName].startTime) +
                " - " + this.doubleToTimeString(obj[day][employee.employeeName].endTime)
                : ""
          }
        })
        result.push(temp)
      })
      console.log(result)
      this.scheduleObj = result
    },
    filterOutPeople(obj) {
      for (let day in obj) {
        if (obj.hasOwnProperty(day)) {
          let employees = this.jsonObjectsToArray(obj[day]).filter(i => i.available)
          let depConst = this.timeObj.departments.filter(i => i.name === "Post Office")[0]
          let timeConst = depConst.timeFrames.filter(i => i.day === day)[0]
          if (employees.length > depConst.requiredEmployeeAtGivenTime) {
            let hasStartingEmployee = false
            let hasClosingEmployee = false
            let keepLooping = true
            while (keepLooping) {
              for (let i = 0; i < employees.length; i++) {
                let employee = employees[i]
                if (employee.startTime === timeConst.open) {
                  if (hasStartingEmployee) {
                    employees.splice(i, 1)
                  }
                  hasStartingEmployee = true
                } else if (employee.endTime === timeConst.close) {
                  if (hasClosingEmployee) {
                    employees.splice(i, 1)
                  }
                  hasClosingEmployee = true
                } else {
                  employees.splice(i, 1)
                }
                if (employees.length <= depConst.requiredEmployeeAtGivenTime) {
                  keepLooping = false
                  break
                }
              }
            }

          } else if (employees.length < depConst.requiredEmployeeAtGivenTime) {
            this.sendNotification("Warning", "warning", `Not enough employees available on ${day}`)
          }

          obj[day] = this.arrayToJsonObjects(employees, day)
        }
      }
      return obj
    },
    arrayToJsonObjects(arr, day) {
      let result = {}
      arr.forEach(item => {
        result[item.name] = item
      })
      return result
    },
    jsonObjectsToArray(object) {
      let result = []
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          object[key]["name"] = key
          result.push(object[key])
        }
      }
      return result
    },
    doubleToTimeString(str) {
      let val = parseFloat(str)
      if (val > 12) {
        val = val - 12
        return `${Math.floor(val)}:${this.getMinutesFromDouble(val - Math.floor(val))} PM`
      } else {
        return `${Math.floor(val)}:${this.getMinutesFromDouble(val - Math.floor(val))} AM`
      }
    },
    getMinutesFromDouble(flt) {
      switch (flt) {
        case 0.25:
          return "15"
        case 0.5:
          return "30"
        case 0.75:
          return "45"
        default:
          return "00"
      }
    }
  },
  computed: {
    liveEmployeeList() {
      return this.employeeList
    }
  },
  data() {
    return {
      scheduleObj: [],
      scheduleHeaders: [
        {text: 'Employee Name', align: 'start', value: 'name'},
        {text: 'Department', value: 'department'},
        {text: 'Total Hours', value: 'totalTimeThisWeek'},
        {text: 'Sunday', value: 'schedule.sunday'},
        {text: 'Monday', value: 'schedule.monday'},
        {text: 'Tuesday', value: 'schedule.tuesday'},
        {text: 'Wednesday', value: 'schedule.wednesday'},
        {text: 'Thursday', value: 'schedule.thursday'},
        {text: 'Friday', value: 'schedule.friday'},
        {text: 'Saturday', value: 'schedule.saturday'}
      ],
      employeeList: [{"employeeName":"Lucy Davey","employeeAvailability":{"sunday":{"startTime":12,"endTime":17},"wednesday":{"startTime":12,"endTime":17},"thursday":{"startTime":12,"endTime":17},"friday":{"startTime":12,"endTime":17},"saturday":{"startTime":12,"endTime":17},"totalHoursAvailable":25},"employeeHoursToWork":"35","employeeDepartment":"Post Office"},{"employeeName":"Ivy Davey","employeeAvailability":{"sunday":{"startTime":12,"endTime":22},"monday":{"startTime":12,"endTime":22},"tuesday":{"startTime":12,"endTime":22},"wednesday":{"startTime":12,"endTime":22},"thursday":{"startTime":12,"endTime":22},"totalHoursAvailable":50},"employeeHoursToWork":"30","employeeDepartment":"Post Office"},{"employeeName":"Belle Javey","employeeAvailability":{"sunday":{"startTime":8,"endTime":22},"monday":{"startTime":16.5,"endTime":22},"wednesday":{"startTime":16.5,"endTime":22},"thursday":{"startTime":16.5,"endTime":22},"friday":{"startTime":16.5,"endTime":22},"saturday":{"startTime":8,"endTime":22},"totalHoursAvailable":50},"employeeHoursToWork":"20","employeeDepartment":"Post Office"},{"employeeName":"Jason Leibel","employeeAvailability":{"monday":{"startTime":8,"endTime":21.5},"tuesday":{"startTime":8,"endTime":21.5},"wednesday":{"startTime":8,"endTime":21.5},"thursday":{"startTime":8,"endTime":21.5},"saturday":{"startTime":8,"endTime":21.5},"totalHoursAvailable":67.5},"employeeHoursToWork":"40","employeeDepartment":"Post Office"},{"employeeName":"Tyson Leibel","employeeAvailability":{"monday":{"startTime":8.5,"endTime":16},"tuesday":{"startTime":8.5,"endTime":16},"wednesday":{"startTime":8.5,"endTime":16},"thursday":{"startTime":8.5,"endTime":16},"friday":{"startTime":8.5,"endTime":16},"totalHoursAvailable":37.5},"employeeHoursToWork":"40","employeeDepartment":"Post Office"}],
      timeObj: {
        departments: [
          {
            name: "Post Office", requiredEmployeeAtGivenTime: 2, totalHoursAvailable: 83.5,
            timeFrames: [
              {day: "sunday", open: 9, close: 21.5},
              {day: "monday", open: 9, close: 21.5},
              {day: "tuesday", open: 9, close: 21.5},
              {day: "wednesday", open: 9, close: 21.5},
              {day: "thursday", open: 9, close: 21.5},
              {day: "friday", open: 9, close: 21.5},
              {day: "saturday", open: 9, close: 17.5}
            ]
          }
        ]
      }
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
