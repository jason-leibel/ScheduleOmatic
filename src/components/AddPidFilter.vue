<template>
  <div>
    <v-card style="width: 70%; padding: 20px; margin-left: auto; margin-right: auto; margin-top: 20px">
      <v-form
          ref="form"
          lazy-validation
      >
        <h1 v-if="parseInProcess" style="background-color: #6278ae; color: white">MUST enter Gmail label for filter with PID: {{ this.parseCurrentPid }}</h1>
        <label for="label" class="AddPidFilter__label">GMail Label</label>
        <vue-simple-suggest
            id="label"
            name="label"
            v-model="labelValue"
            class="AddPidFilter__input-select"
            :list="labelList"
            :max-suggestions="0"
            :filter-by-query="true">
          <!-- Filter by input text to only show the matching results -->
        </vue-simple-suggest>
        <span v-show="labelValue === ''" class="AddPidFilter__error"><img width="12px" height="12px" src="../images/error__icon.png"/> Select or enter a Gmail label for the filter to be applied to.</span>
        <span v-show="!isRealLabel" class="AddPidFilter__warning"><img width="12px" height="12px" src="../images/warning__icon.png"/> This Label does not exist and will be added if you add this to the list below.<br>
        Note: if you want to add a sublabel add a slash (ex. "/") afterr a pre existing label then type the sublabel name</span>
        <v-text-field
            v-if="!parseInProcess"
            v-model="pidValue"
            label="*PID"
            placeholder="ABCD"
            :required="true"
        ></v-text-field>
        <span v-if="!parseInProcess" v-show="pidValue === ''" class="AddPidFilter__error"><img width="12px" height="12px" src="../images/error__icon.png"/> Must provide PID letters.</span>

        <v-text-field
            v-if="!parseInProcess"
            v-model="emailListValue"
            label="Email list"
            placeholder="email@gmail.com; email2@gmail.com"
            required
        ></v-text-field>
        <div v-if="!parseInProcess" style="margin: 0 auto; width: 100%; text-align: center;">
          <v-btn
              v-if="false"
              x-large
              color="success"
              dark
              style="display: block;"
              :disabled="!isSignedIn"
              @click="addPidFilter">Add PID Filters
          </v-btn>

          <v-btn
              x-large
              dark
              color="primary"
              style="margin: 10px; background-color: #62ae82 !important;"
              :disabled="!isSignedIn"
              @click="addToList">Add filter to List
          </v-btn>
          <v-btn
              x-large
              dark
              style="margin: 10px; background-color: #ae6265 !important;"
              :disabled="!isSignedIn"
              @click="clearList">Clear Filter List
          </v-btn>
          <v-btn
              x-large
              dark
              style="margin: 10px; background-color: #6278ae !important;"
              :disabled="!isSignedIn"
              @click="downloadFile">Download (.xml)
          </v-btn>
        </div>
        <div v-else style="margin: 0 auto; width: 100%; text-align: center;">
          <v-btn
              x-large
              dark
              style="margin: 10px; background-color: #ae6265 !important;"
              :disabled="!isSignedIn"
              @click="cancelParse">Cancel
          </v-btn>
          <v-btn
              x-large
              dark
              color="primary"
              style="margin: 10px; background-color: #62ae82 !important;"
              :disabled="!isSignedIn"
              @click="assignLabelToPid">Add Label
          </v-btn>
        </div>
      </v-form>
      <iframe id="my_iframe" style="display:none;"></iframe>
      <v-spacer/>
      <v-data-table
      :headers="headers"
      :items="filterList"
      :items-per-page="10"/>
    </v-card>
    <v-card style="width: 70%; padding: 20px; margin-left: auto; margin-right: auto; margin-top: 20px">
      <h1>Parse PID list to create filters</h1>
      <v-switch
          v-model="userUnderstandsMayNotWork"
          label="I understand this may not work 100% so I will double check through out labels are correct"
          color="red"
      ></v-switch>
      <v-textarea :disabled="!userUnderstandsMayNotWork" placeholder="try pasting a list of PID filters in here for me to parse"
      v-model="toBeParsedListValue"/>
      <v-btn
          x-large
          dark
          color="primary"
          style="margin: 10px; background-color: #6278ae !important;"
          :disabled="!isSignedIn"
          @click="parseAndAddToList">Parse and Add to list
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="js">
import axios from "axios";
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css'

export default {
  name: "AddPidFilter",
  components: {
    VueSimpleSuggest
  },
  data() {
    return {
      labels: [],
      labelValue: "",
      pidValue: "",
      emailListValue: "",
      parseInProcess: false,
      parseCurrentPid: null,
      parsePidLocation: 0,
      userUnderstandsMayNotWork: false,
      toBeParsedListValue: '',
      filterList: [],
      headers: [
        { text: 'PID', align: 'start', value: 'pid' },
        { text: 'Label', value: 'label' },
        { text: 'Emails', value: 'email' }
      ]
    }
  },
  props: [
    "isSignedIn",
    "authInstance"
  ],
  watch: {
    authInstance(n) {
      if (n !== null) {
        axios.get(`https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(n.currentUser.getBasicProfile().getEmail())}/labels`, {
          headers: {
            Authorization: `Bearer ${n.currentUser.getAuthResponse().access_token}`,
            'content-type': 'application/json'
          }
        }).then(function(resp) {
          this.labels = resp.data.labels
        }.bind(this)).catch(err => {
          console.log(err)
        })
      }
    }
  },
  methods: {
    assignLabelToPid() {
      if (this.labelValue === "") {
        this.sendNotification("Error", "error", "You must provide a GMail label name")
        return
      }
      if (!this.isRealLabel) {
        this.createLabel(this.labelValue)
      }
      this.filterList[this.parsePidLocation].label = this.labelValue
      if (this.parsePidLocation === this.filterList.length - 1) {
        this.parseInProcess = false
        this.labelValue = ""
        this.parsePidLocation = 0
      } else {
        this.labelValue = ""
        this.parsePidLocation += 1
        this.parseCurrentPid = this.filterList[this.parsePidLocation].pid
      }

    },
    cancelParse() {
      this.clearList()
      this.parseInProcess = false
      this.parseCurrentPid = null
    },
    generateUniqueID() {
      // always start with a letter (for DOM friendlyness)
      var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
      do {
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode = Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64) {
          // exclude all chars between : (58) and @ (64)
          idstr += String.fromCharCode(ascicode);
        }
      } while (idstr.length < 32);

      return (idstr);
    },
    clearList() {
      this.filterList = []
    },
    addToList() {
      if(!this.verify()) return;
      this.filterList.push({
        label: this.labelValue,
        pid: this.pidValue,
        email: this.emailListValue
      })

      if (!this.isRealLabel) {
        this.createLabel(this.labelValue)
      }

      this.labelValue = ""
      this.pidValue = ""
      this.emailListValue = ""

    },
    async addPidFilter() {
      if(!this.verify()) return;
      const label = this.fetchLabelobject()
      const criteria = []

      criteria.push({
        "query": `${this.pidValue}`
      })
      if (this.emailListValue !== "") {
        this.emailListValue.split('; ').forEach(email => {
          criteria.push({
            "to": `${email}`
          })
          criteria.push({
            "from": `${email}`
          })
        })
      }

      for (let i = 0; i < criteria.length; i++) {
        await this.createFilter(label, criteria[i])
      }
    },
    verify() {
      if (this.labelValue === '' || this.pidValue === '') {
        this.sendNotification('Form Not Filled out', 'error', 'Please fix errors in red before trying to create?')
        return false
      }
      if (!this.authInstance) {
        this.sendNotification('Incorrect Login Details', 'error', 'Doesnt appear you are logged in, perhaps refreshing will fix?')
        return false
      }
      return true
    },
    fetchLabelobject() {
      let obj = {}
      this.labels.forEach(label => {
        if (label.name === this.labelValue) {
          obj = label
        }
      })
      return obj
    },
    async createLabel(label) {
      return axios.post(`https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(this.authInstance.currentUser.getBasicProfile().getEmail())}/labels`,
          {
            "labelListVisibility": "labelShow",
            "messageListVisibility": "show",
            "name": label
          }, {
            headers: {
              Authorization: `Bearer ${this.authInstance.currentUser.getAuthResponse().access_token}`,
              'content-type': 'application/json'
            }
          }).then(() => {
        this.labels.push({
          id: this.generateUniqueID(),
          name: label,
          label
        })
        this.sendNotification('Success!', 'success', `Label created for: ${label}`)
      }).catch(err => {
        this.sendNotification(`Error code: ${err.response.data.error.code}`, 'error', `Message: ${err.response.data.error.message} >>> for label: ${label}`)
      })
    },
    async createFilter(label, criteria) {
      return axios.post(`https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(this.authInstance.currentUser.getBasicProfile().getEmail())}/settings/filters`,
          {"id": this.generateUniqueID().toString(), criteria, "action": {"addLabelIds": [`${label.id}`]}}, {
            headers: {
              Authorization: `Bearer ${this.authInstance.currentUser.getAuthResponse().access_token}`,
              'content-type': 'application/json'
            }
          }).then(() => {
        this.sendNotification('Success!', 'success', `Filter created for the following criteria: ${JSON.stringify(criteria)}`)
      }).catch(err => {
        this.sendNotification(`Error code: ${err.response.data.error.code}`, 'error', `Message: ${err.response.data.error.message} >>> for filter criteria: ${JSON.stringify(criteria)}`)
      })
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
    },
    downloadFile() {
      const fl = this.filterList
      if (this.filterList.length === 0) {
        this.sendNotification('Error', 'error', 'Filter list is empty')
        return
      }

      const entries = []
      for (let i = 0; i < fl.length; i++) {
        entries.push(`<entry><category term="filter"></category><apps:property name='hasTheWord' value='${fl[i].pid}' />
                   <apps:property name='label' value='${fl[i].label}'/></entry>`)
        if (fl[i].email !== "" && fl[i].email.length !== 0) {
          fl[i].email.split('; ').forEach(email => {
            entries.push(`<entry><category term="filter"></category><apps:property name='to' value='${email}' />
                   <apps:property name='label' value='${fl[i].label}'/></entry>`)
            entries.push(`<entry><category term="filter"></category><apps:property name='from' value='${email}' />
                   <apps:property name='label' value='${fl[i].label}'/></entry>`)
          })
        }
      }

      let filename = "filters.xml";
      let pom = document.createElement('a');
      let bb = new Blob([`<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>
${entries.join('')}
</feed>`], {type: 'text/plain'});

      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);

      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
      pom.draggable = true;
      pom.classList.add('dragout');

      pom.click();
      this.sendNotification('Success', 'success', 'File should have been downloaded as XML, please upload this document to your filters and add them or verify they are correct!')

    },
    parseAndAddToList() {
      const cp = this.toBeParsedListValue
      const list = []
      cp.split("PID: ").filter(i => i !== "").forEach(partner => {
        let pid = partner.substring(0, partner.indexOf(" ")),
            emails = []
        if (partner.toLowerCase().includes("email")) {
          emails = partner.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi).join("; ")
        }
        if (pid.includes(" ")) {
          pid = pid.substring(0, pid.indexOf(" "))
        } else if (pid.includes("\n")) {
          pid = pid.substring(0, pid.indexOf("\n"))
        }
        list.push({
          label: '',
          pid,
          email: emails
        })
      })
      if (list.length === 0) {
        this.sendNotification("Error", "error", "Nothing will be added to list")
        return
      } else {
        this.sendNotification("Warning", "warning", "You have parsed the list, now you MUST enter" +
            " a GMail label for each PID. Also please verify the information in the table was parsed correctly")
      }
      this.filterList = list
      this.parseInProcess = true
      this.parsePidLocation = 0
      this.parseCurrentPid = list[0].pid
    }
  },
  computed: {
    labelList() {
      return this.labels.map(i => i.name)
    },
    isRealLabel() {
      let exists = false
      this.labels.forEach(label => {
        if (label.name === this.labelValue) {
          exists = true
        }
      })

      return exists
    }
  }
}
</script>

<style lang="scss">
.AddPidFilter__error {
  color: red;
  display: block;
}

.AddPidFilter__warning {
  color: #d0c84c;
  display: block;
}

.v-label {
  right: auto !important;
  font-size: 20px;
}
</style>
