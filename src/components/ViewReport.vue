<template>
  <v-container>
    <v-layout>
     <v-flex  xs12 md8 lg6 xl6 class="mr-4">
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">View Report</h3>
          </v-card-title>
          <v-card-actions>
            <v-flex xs11 sm5>
              <v-menu
                ref="menuFrom"
                lazy
                :close-on-content-click="false"
                v-model="menuFrom"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
                :return-value.sync="dateFrom"
              >
                <v-text-field
                  slot="activator"
                  label="Date Start"
                  v-model="dateFrom"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker :first-day-of-week="1" v-model="dateFrom" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuFrom = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="selectDateFrom()">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm5>
              <v-menu
                ref="menuTo"
                lazy
                :close-on-content-click="false"
                v-model="menuTo"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
                :return-value.sync="dateTo"
              >
                <v-text-field
                  slot="activator"
                  label="Date End"
                  v-model="dateTo"
                  prepend-icon="event"
                  readonly
                  class="mr-3"
                ></v-text-field>
                <v-date-picker :first-day-of-week="1" v-model="dateTo" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuTo = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="selectDateTo()">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-btn flat color="primary" @click="getReport()" :disabled="!dateFrom || !dateTo" :loading="pendingStatusResponse">Get report
              <v-icon right>assignment</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn fla @click="dateFrom = dateTo = null" :disabled="!dateFrom && !dateTo">Clear</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-4">
     <v-flex  class="mr-4">
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">By tasks</h3>
            <v-spacer></v-spacer>
            <h4>Total: {{byTasksTotal}}</h4>
          </v-card-title>
          <v-data-table 
            :headers="byTasksHeaders"
            :items="byTasks"
            item-key="name"
            class="elevation-1" 
            disable-initial-sort
            hide-actions
          >
            <template slot="headerCell" slot-scope="props">
              <span >{{ props.header.text }}</span>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">{{props.item.name}}</td>
                <td class="text-xs-left">{{props.item.description}}</td>
                <td class="text-xs-left" :class="[props.item.invalid ? 'invalid' : '']">{{props.item.hours}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex class="mr-4">
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">By date</h3>
            <v-spacer></v-spacer>
            <h4>Total: {{byDateTotal}}</h4>
          </v-card-title>
          <v-data-table 
            :headers="byDateHeaders"
            :items="byDate"
            item-key="name"
            class="elevation-1" 
            disable-initial-sort
            hide-actions
          >
            <template slot="headerCell" slot-scope="props">
              <span >{{ props.header.text }}</span>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">{{props.item.date}}</td>
                <td class="text-xs-left">{{props.item.hours}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ViewReport',
  computed: {
    ...mapState('report', [ 'pendingStatusResponse', 'byTasks', 'byDate', 'byDateTotal', 'byTasksTotal' ])
  },
  methods: {
    ...mapActions('report', [ 'initReportData', 'setDateFrom', 'setDateTo', 'resetState' ]),
    selectDateFrom () {
      this.$refs.menuFrom.save(this.dateFrom)
      this.setDateFrom(this.dateFrom)
    },
    selectDateTo () {
      this.$refs.menuTo.save(this.dateTo)
      this.setDateTo(this.dateTo)
    },
    getReport () {
      this.initReportData()
    }
  },
  data: () => ({
    dateFrom: null,
    dateTo: null,
    menuFrom: false,
    menuTo: false,
    byTasksHeaders: [
      { text: 'Case', value: 'name', sortable: false },
      { text: 'Description', value: 'description' },
      { text: 'Hours', value: 'hours' }
    ],
    byDateHeaders: [
      { text: 'Date', value: 'date' },
      { text: 'Hours', value: 'hours' }
    ]
  }),
  created () {
    this.resetState()
    .then(() => { this.initReportData() })
  }
}
</script>
