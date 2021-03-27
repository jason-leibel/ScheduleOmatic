<template>
  <v-card style="width: 100%; padding: 20px; margin: 20px auto;">
    <h1>Availability:</h1>
    <div class="AddEmployee__day-container">
      <h4>Set Defaults:</h4>
      <timepicker v-model="startTimeDefault" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeDefault" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" placeholder="End time"
                  format="hh:mm A"/>
      <v-btn
          color="primary"
          class="mr-4"
          style="height: 25px"
          @click="setDefaults"
      >
        Set all
      </v-btn>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Sunday:</h4>
      <timepicker v-model="startTimeSunday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableSunday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeSunday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableSunday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableSunday">&nbsp;Not Available</label>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Monday:</h4>
      <timepicker v-model="startTimeMonday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableMonday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeMonday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableMonday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableMonday">&nbsp;Not Available</label>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Tuesday:</h4>
      <timepicker v-model="startTimeTuesday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableTuesday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeTuesday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableTuesday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableTuesday">&nbsp;Not Available</label>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Wednesday:</h4>
      <timepicker v-model="startTimeWednesday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableWednesday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeWednesday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableWednesday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableWednesday">&nbsp;Not Available</label>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Thursday:</h4>
      <timepicker v-model="startTimeThursday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableThursday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeThursday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableThursday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableThursday">&nbsp;Not Available</label>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Friday:</h4>
      <timepicker v-model="startTimeFriday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableFriday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeFriday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableFriday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableFriday">&nbsp;Not Available</label>
    </div>
    <div class="AddEmployee__day-container">
      <h4>Saturday:</h4>
      <timepicker v-model="startTimeSaturday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableSaturday" placeholder="Start time"
                  format="hh:mm A"/>
      <timepicker v-model="endTimeSaturday" class="AddEmployee__day-time-picker" hide-disabled-items
                  :minute-range="minuteRange" :disabled="notAvailableSaturday" placeholder="End time"
                  format="hh:mm A"/>
      <label><input type="checkbox" v-model="notAvailableSaturday">&nbsp;Not Available</label>
    </div>
  </v-card>
</template>

<script>
import timepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

export default {
  name: "EmployeeAvailability",
  components: {
    timepicker
  },
  data() {
    return {
      minuteRange: [0, 15, 30, 45, 60],
      startTimeDefault: "",
      startTimeSunday: "",
      startTimeMonday: "",
      startTimeTuesday: "",
      startTimeWednesday: "",
      startTimeThursday: "",
      startTimeFriday: "",
      startTimeSaturday: "",
      endTimeDefault: "",
      endTimeSunday: "",
      endTimeMonday: "",
      endTimeTuesday: "",
      endTimeWednesday: "",
      endTimeThursday: "",
      endTimeFriday: "",
      endTimeSaturday: "",
      notAvailableSunday: false,
      notAvailableMonday: false,
      notAvailableTuesday: false,
      notAvailableWednesday: false,
      notAvailableThursday: false,
      notAvailableFriday: false,
      notAvailableSaturday: false,
    }
  },
  methods: {
    setDefaults() {
      if (!this.notAvailableSunday) {
        this.startTimeSunday = this.startTimeDefault
        this.endTimeSunday = this.endTimeDefault
      }

      if (!this.notAvailableMonday) {
        this.startTimeMonday = this.startTimeDefault
        this.endTimeMonday = this.endTimeDefault
      }

      if (!this.notAvailableTuesday) {
        this.startTimeTuesday = this.startTimeDefault
        this.endTimeTuesday = this.endTimeDefault
      }

      if (!this.notAvailableWednesday) {
        this.startTimeWednesday = this.startTimeDefault
        this.endTimeWednesday = this.endTimeDefault
      }

      if (!this.notAvailableThursday) {
        this.startTimeThursday = this.startTimeDefault
        this.endTimeThursday = this.endTimeDefault
      }

      if (!this.notAvailableFriday) {
        this.startTimeFriday = this.startTimeDefault
        this.endTimeFriday = this.endTimeDefault
      }

      if (!this.notAvailableSaturday) {
        this.startTimeSaturday = this.startTimeDefault
        this.endTimeSaturday = this.endTimeDefault
      }
    },
    getAvailability() {
      let time = 0.0
      let ranges = {}
      if (!this.notAvailableSunday) {
        ranges['sunday'] = {}
        ranges['sunday']['startTime'] = this.getDoubleFromTime(this.startTimeSunday)
        ranges['sunday']['endTime'] = this.getDoubleFromTime(this.endTimeSunday)
        time += this.doTimeMath(this.endTimeSunday, this.startTimeSunday)
      }

      if (!this.notAvailableMonday) {
        ranges['monday'] = {}
        ranges['monday']['startTime'] = this.getDoubleFromTime(this.startTimeMonday)
        ranges['monday']['endTime'] = this.getDoubleFromTime(this.endTimeMonday)
        time += this.doTimeMath(this.endTimeMonday, this.startTimeMonday)
      }

      if (!this.notAvailableTuesday) {
        ranges['tuesday'] = {}
        ranges['tuesday']['startTime'] = this.getDoubleFromTime(this.startTimeTuesday)
        ranges['tuesday']['endTime'] = this.getDoubleFromTime(this.endTimeTuesday)
        time += this.doTimeMath(this.endTimeTuesday, this.startTimeTuesday)
      }

      if (!this.notAvailableWednesday) {
        ranges['wednesday'] = {}
        ranges['wednesday']['startTime'] = this.getDoubleFromTime(this.startTimeWednesday)
        ranges['wednesday']['endTime'] = this.getDoubleFromTime(this.endTimeWednesday)
        time += this.doTimeMath(this.endTimeWednesday, this.startTimeWednesday)
      }

      if (!this.notAvailableThursday) {
        ranges['thursday'] = {}
        ranges['thursday']['startTime'] = this.getDoubleFromTime(this.startTimeThursday)
        ranges['thursday']['endTime'] = this.getDoubleFromTime(this.endTimeThursday)
        time += this.doTimeMath(this.endTimeThursday, this.startTimeThursday)
      }

      if (!this.notAvailableFriday) {
        ranges['friday'] = {}
        ranges['friday']['startTime'] = this.getDoubleFromTime(this.startTimeFriday)
        ranges['friday']['endTime'] = this.getDoubleFromTime(this.endTimeFriday)
        time += this.doTimeMath(this.endTimeFriday, this.startTimeFriday)
      }

      if (!this.notAvailableSaturday) {
        ranges['saturday'] = {}
        ranges['saturday']['startTime'] = this.getDoubleFromTime(this.startTimeSaturday)
        ranges['saturday']['endTime'] = this.getDoubleFromTime(this.endTimeSaturday)
        time += this.doTimeMath(this.endTimeSaturday, this.startTimeSaturday)
      }
      ranges["totalHoursAvailable"] = time
      return ranges
    },
    doTimeMath(endTime, startTime) {
      return (this.getDoubleFromTime(endTime) - this.getDoubleFromTime(startTime))
    },
    getDoubleFromTime(str) {
      let dbl = 0.0
      dbl += parseInt(str.substring(str.indexOf(":"), str.indexOf(""))) + this.getDoubleFromMinutes(str.substring(str.indexOf(":") + 1, str.indexOf(" ")))
      if (str.includes("PM")) {
        dbl += 12
      }

      return dbl
    },
    getDoubleFromMinutes(str) {
      switch (str) {
        case "15":
          return 0.25
        case "30":
          return 0.50
        case "45":
          return 0.75
        default:
          return 0
      }
    }
  }
}
</script>

<style>
.AddEmployee__day-container {
  width: 25%;
  padding: 0;
  margin: 0;
  display: inline-block;
}

.AddEmployee__day-time-picker > input:disabled {
  background-color: #F1F1F1;
}

.AddEmployee__day-time-picker {
  width: 100%;
  margin: 5px 0;
}
</style>