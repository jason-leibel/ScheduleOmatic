<template>
  <v-card
      class="mx-auto"
      tile
      style="width: 80%; padding: 20px; margin: 20px auto;"
  >
    <h1>Employee List:</h1>
    <v-data-table
        :headers="headers"
        :items="liveEmployeeList"
        :items-per-page="10">
      <template v-slot:item.actions="{ item }">
        <v-btn
            color="error"
            class="mr-4"
            @click="deleteItem(item)"
        >
          x
        </v-btn>
      </template>
    </v-data-table>

    <v-file-input
        v-model="file"
        accept="*.json"
        label="File input"
        on
    ></v-file-input>

    <v-btn
        color="primary"
        class="mr-4"
        @click="saveEmployeeList"
    >
      Save Employee List to file
    </v-btn>

    <v-btn
        color="success"
        class="mr-4"
        @click="generateSchedule"
    >
      Generate Schedule
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: "EmployeeList",
  props: [
    "employeeList"
  ],
  data() {
    return {
      file: null,
      headers: [
        {text: 'Employee Name', align: 'start', value: 'employeeName'},
        {text: 'Desired Work Hours', value: 'employeeHoursToWork'},
        {text: 'Department', value: 'employeeDepartment'},
        {text: 'Hours Available to work', value: 'employeeAvailability.totalHoursAvailable'},
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  methods: {
    saveEmployeeList() {
      if (this.employeeList.length === 0) {
        this.$emit("notification", "Not Enough People", "error", "No employee`s were found added to the list")
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.employeeList, null, 2)], {
          type: "text/plain"
        }));
        a.setAttribute("download", "EmployeeList.txt");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    generateSchedule() {
      if (this.employeeList.length === 0) {
        this.$emit("notification", "Not Enough People", "error", "No employee`s were found added to the list")
      } else {
        let lst = this.employeeList.sort((a, b) => {
          return a.employeeAvailability.totalHoursAvailable - b.employeeAvailability.totalHoursAvailable
        })
        debugger
      }
    },
    deleteItem(item) {
      let index = this.employeeList.indexOf(item)
      this.employeeList.splice(index, 1)
    }
  },
  computed: {
    liveEmployeeList() {
      return this.employeeList
    }
  }
}
</script>

<style scoped>

</style>