<template>
    <v-expansion-panels v-model="panel" multiple style="width: 80%; margin: 10px auto" accordion>
      <v-expansion-panel
          v-for="(item,i) in 1"
          :key="i"
      >
        <v-expansion-panel-header><h1>Add Employee</h1></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form
              ref="form"
          >
            <v-text-field
                v-model="employeeName"
                :counter="20"
                label="Employee Name"
                required
            ></v-text-field>

            <v-text-field
                v-model="hoursToWorkWeek"
                type="number"
                label="Requested hours for the week"
                required
            ></v-text-field>

            <v-select
                v-model="employeeDepartment"
                :items="departments"
                label="Employee Department"
            ></v-select>

            <EmployeeAvailability :key="componentKey" ref="employeeAvailability"/>

            <v-btn
                color="success"
                class="mr-4"
                @click="saveEmployee"
            >
              Save
            </v-btn>

            <v-btn
                color="error"
                class="mr-4"
                @click="reset"
            >
              Reset Form
            </v-btn>

          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import EmployeeAvailability from './EmployeeAvailability'

export default {
  name: "AddEmployee",
  components: {
    EmployeeAvailability
  },
  data() {
    return {
      employeeName: "",
      hoursToWorkWeek: "",
      employeeDepartment: "",
      componentKey: 0,
      panel: [0],
      departments: [
          "Post Office",
          "Automotive Parts",
          "Customer Service"
      ]
    }
  },
  methods: {
    saveEmployee() {
      let employee = {}
      employee["employeeName"] = this.employeeName
      employee["employeeAvailability"] = this.$refs.employeeAvailability[0].getAvailability()
      employee["employeeHoursToWork"] = this.hoursToWorkWeek
      employee["employeeDepartment"] = this.employeeDepartment
      debugger
      if (employee["employeeAvailability"]["totalHoursAvailable"] < this.hoursToWorkWeek) {
        this.$emit("notification", "Warning", "warning", "Employee availability is less then desired hours per week.")
      }
      this.$emit("notification", "Success", "success", "Employee added to list")
      this.$emit("addEmployee", employee)
      this.reset()

    },
    reset() {
      // Empty fields.
      this.employeeName = ""
      this.hoursToWorkWeek = ""
      this.employeeDepartment = ""
      this.componentKey += 1
    }
  }
}
</script>

<style scoped>

</style>
