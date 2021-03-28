<template>
  <v-expansion-panels style="width: 80%; margin: 10px auto" accordion>
    <v-expansion-panel
        v-for="(item,i) in 1"
        :key="i"
    >
      <v-expansion-panel-header><h1>Employee List</h1></v-expansion-panel-header>
      <v-expansion-panel-content>
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
    </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
export default {
  name: "EmployeeList",
  props: [
    "employeeList"
  ],
  data() {
    return {
      headers: [
        {text: 'Employee Name', align: 'start', value: 'employeeName'},
        {text: 'Desired Work Hours', value: 'employeeHoursToWork'},
        {text: 'Department', value: 'employeeDepartment'},
        {text: 'Hours Available to work', value: 'employeeAvailability.totalHoursAvailable'},
        {text: 'Actions', value: 'actions', sortable: false}
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
        this.$emit("generateSchedule", this.shuffleArray(this.employeeList))
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