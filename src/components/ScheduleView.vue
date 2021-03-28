<template>
  <v-expansion-panels style="width: 80%; margin: 10px auto" accordion>
    <v-expansion-panel
        v-for="(item,i) in 1"
        :key="i"
    >
      <v-expansion-panel-header><h1>Schedule View</h1></v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
            :headers="scheduleHeaders"
            :items="scheduleObj"
            dense
            group-by="department"
            :items-per-page="10">
          <template v-slot:group.header="{items, isOpen, toggle}">
            <th colspan="9" @click="toggle">
              <v-icon
              >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
              </v-icon>
              {{ items[0].department }}
            </th>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td v-for="(header,key) in scheduleHeaders" :key="key">
                <v-edit-dialog
                    :return-value.sync="item[header.value]"
                    large
                > {{ item[header.value] }}
                  <template v-slot:input>
                    <v-text-field
                        v-model="item[header.value]"
                        label="Edit"
                        single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "ScheduleView",
  props: [
    "employeeList"
  ],
  methods: {
    generateSchedule(list) {
      this.scheduleObj = []

      this.timeObj.departments.forEach(dep => {
        let scheduleObj = {}

        let depart = this.timeObj.departments.filter(department => department.name === dep.name)[0]
        let workers = list.filter(person => person.employeeDepartment === dep.name)
        depart.timeFrames.forEach(tf => {
          scheduleObj[tf.day] = {}
          workers.forEach(wrk => {
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
        this.translateToTable(scheduleObj, dep.name)
      })
    },
    translateToTable(obj, department) {
      let result = []
      obj = this.filterOutPeople(obj, department)
      // {friday: { Test User: { available: true, startTime: 10.5, endTime: 18.5, name: "Test User"}
      let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      this.employeeList.filter(e => e.employeeDepartment === department).forEach(employee => {
        let temp = {}
        temp["name"] = employee.employeeName
        temp["department"] = employee.employeeDepartment
        temp["totalTimeThisWeek"] = 0
        days.forEach(day => {
          if (obj[day][employee.employeeName] !== undefined) {
            if (obj[day][employee.employeeName].available) {
              temp["totalTimeThisWeek"] += obj[day][employee.employeeName].endTime - obj[day][employee.employeeName].startTime
            }
            temp[day] = (obj[day][employee.employeeName].available) ?
                this.doubleToTimeString(obj[day][employee.employeeName].startTime) +
                " - " + this.doubleToTimeString(obj[day][employee.employeeName].endTime)
                : "Not Available"
          }
        })
        result.push(temp)
      })
      result.forEach(res => {
        this.scheduleObj.push(res)
      })
    },
    filterOutPeople(obj, department) {
      let timeWorked = {}
      let middleDayOptions = {}
      for (let day in obj) {
        if (obj.hasOwnProperty(day)) {
          if (middleDayOptions[day] === undefined) {
            middleDayOptions[day] = []
          }
          // { friday: Test User: {available: true, startTime: 10.5, endTime: 18.5, name: "Test User"}
          let employees = this.shuffleArray(this.jsonObjectsToArray(obj[day]))
          let depConst = this.timeObj.departments.filter(i => i.name === department)[0]
          let timeConst = depConst.timeFrames.filter(i => i.day === day)[0]

          if (employees.length > depConst.requiredEmployeeAtGivenTime) {
            let hasStartingEmployee = false
            let hasClosingEmployee = false
            let startingEmployee = null
            let closingEmployee = null
            let keepLooping = true
            while (keepLooping) {
              for (let i = 0; i < employees.length; i++) {
                let employee = employees[i]
                if (employee.available) {
                  if (employee.startTime === timeConst.open) {
                    if (hasStartingEmployee) {
                      if (timeWorked[startingEmployee.name] >= this.employeeList.filter(e => e.employeeName === startingEmployee.name)[0].employeeHoursToWork) {
                        middleDayOptions[day].push(startingEmployee)
                        employees.splice(employees.indexOf(startingEmployee), 1)
                        startingEmployee = employee
                      } else {
                        employees.splice(i, 1)
                      }
                    }
                    startingEmployee = employee
                    hasStartingEmployee = true
                  } else if (employee.endTime === timeConst.close) {
                    if (hasClosingEmployee) {
                      if (timeWorked[closingEmployee.name] >= this.employeeList.filter(e => e.employeeName === closingEmployee.name)[0].employeeHoursToWork) {
                        middleDayOptions[day].push(closingEmployee)
                        employees.splice(employees.indexOf(closingEmployee), 1)
                        closingEmployee = employee
                      } else {
                        employees.splice(i, 1)
                      }
                    }
                    closingEmployee = employee
                    hasClosingEmployee = true
                  } else {
                    // Employee can work, not start or close tho
                    middleDayOptions[day].push(employee)
                    employees.splice(i, 1)
                  }
                }
                if (employees.filter(e => e.available).length <= depConst.requiredEmployeeAtGivenTime) {
                  keepLooping = false
                  employees.forEach(employ => {
                    if (timeWorked[employ.name] === undefined) {
                      timeWorked[employ.name] = 0
                    }
                    timeWorked[employ.name] += employee.endTime - employee.startTime
                  })
                  break
                }
              }
            }
          } else if (employees.length < depConst.requiredEmployeeAtGivenTime) {
            this.sendNotification("Warning", "warning", `Not enough employees available on ${day} in ${department}`)
          }

          obj[day] = this.arrayToJsonObjects(employees, day)
        }
      }
      console.log(middleDayOptions)
      return obj
    },
    arrayToJsonObjects(arr, day) {
      let result = {}
      arr.forEach(item => {
        //available: true, startTime: 10.5, endTime: 18.5, name: "Test User"
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
    shuffleArray(array) {
      let copy = Array.from(array)
      for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy
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
  data() {
    return {
      scheduleObj: [],
      scheduleHeaders: [
        {text: 'Employee Name', align: 'start', value: 'name'},
        {text: 'Total Hours', value: 'totalTimeThisWeek'},
        {text: 'Sunday', value: 'sunday'},
        {text: 'Monday', value: 'monday'},
        {text: 'Tuesday', value: 'tuesday'},
        {text: 'Wednesday', value: 'wednesday'},
        {text: 'Thursday', value: 'thursday'},
        {text: 'Friday', value: 'friday'},
        {text: 'Saturday', value: 'saturday'}
      ],
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
          },
          {
            name: "Automotive Parts", requiredEmployeeAtGivenTime: 2, totalHoursAvailable: 83.5,
            timeFrames: [
              {day: "sunday", open: 10.5, close: 21},
              {day: "monday", open: 10.5, close: 21},
              {day: "tuesday", open: 10.5, close: 21},
              {day: "wednesday", open: 10.5, close: 21},
              {day: "thursday", open: 10.5, close: 21},
              {day: "friday", open: 10.5, close: 21},
              {day: "saturday", open: 10.5, close: 17}
            ]
          },
          {
            name: "Customer Service", requiredEmployeeAtGivenTime: 1, totalHoursAvailable: 83.5,
            timeFrames: [
              {day: "sunday", open: 10.5, close: 21},
              {day: "monday", open: 10.5, close: 21},
              {day: "tuesday", open: 10.5, close: 21},
              {day: "wednesday", open: 10.5, close: 21},
              {day: "thursday", open: 10.5, close: 21},
              {day: "friday", open: 10.5, close: 21},
              {day: "saturday", open: 10.5, close: 17}
            ]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>