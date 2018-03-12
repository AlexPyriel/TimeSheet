<template>
  <v-card class="mt-4">
    <v-card-title>
      <v-tooltip top>
        <v-switch class="mr-5" hide-details v-model="displayHidden" :disabled="expanded" slot="activator" prepend-icon="visibility_off"></v-switch>
        <span>Show hidden tasks</span>
      </v-tooltip>
      <span class="ts-week-summary">Week summary: {{ weekSummary }} hours</span>
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search" :disabled="expanded"></v-text-field>
    </v-card-title>
    <v-data-table 
      :headers="headers"
      :items="items"
      :search="search"
      item-key="name"
      class="elevation-1" 
      :loading="pendingTasksResponse"
      disable-initial-sort
      rows-per-page-text="Tasks per page:"
      :rows-per-page-items="[{ text: 'All', value:-1 }, 5, 10, 25]"
    >
      <template slot="headerCell" slot-scope="props">
        <span :class="['ts-th', props.header.today ? 'ts-th_today' : '']">{{ props.header.text }}</span>
        <br>
        <span class="mr-2">{{daySummary[props.header.value] ? daySummary[props.header.value] : ''}}</span>
      </template>
      <template slot="items" slot-scope="props">
        <tr @keypress="filterInput($event)" @paste="$event.preventDefault()">
          <td @click="edit(props)">{{ props.item.name }}</td>
          <td class="text-xs-left ts-td-description" @click="edit(props)">
            <v-tooltip left max-width="300px">
              <span slot="activator">{{ props.item.description }}</span>
              <span>{{ props.item.description || '' }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[0].value]" autofocus></v-text-field>
            <div v-else>{{ props.item[week[0].value] || 0 }}</div>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[1].value]"></v-text-field>
            <div v-else>{{ props.item[week[1].value] || 0 }}</div>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[2].value]"></v-text-field>
            <div v-else>{{ props.item[week[2].value] || 0 }}</div>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[3].value]"></v-text-field>
            <div v-else>{{ props.item[week[3].value] || 0 }}</div>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[4].value]"></v-text-field>
            <div v-else>{{ props.item[week[4].value] || 0 }}</div>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[5].value]"></v-text-field>
            <div v-else>{{ props.item[week[5].value] || 0 }}</div>
          </td>
          <td class="text-xs-left ts-td" @click="edit(props)">
            <v-text-field v-if="props.expanded" class="ts-input_hours" placeholder="0" v-model.number="tempProps[week[6].value]"></v-text-field>
            <div v-else>{{ props.item[week[6].value] || 0 }}</div>
          </td>
          <td class="justify-center layout px-0">
            <div v-if="props.expanded">
              <v-tooltip top>
                <v-btn icon class="mx-0" slot="activator" @click="submit(props)" :disabled="pendingTasksResponse">
                  <v-icon color="primary">update</v-icon>
                </v-btn>
                <span>Update task</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn icon class="mx-0" slot="activator" @click="cancel(props)" :disabled="pendingTasksResponse">
                  <v-icon color="error">not_interested</v-icon>
                </v-btn>
                <span>Cancel</span>
              </v-tooltip>
            </div>
            <div v-else>
              <v-tooltip left v-if="props.item.hidden">
                <v-btn icon class="mx-0" slot="activator" @click="updateVisibility(props.item)" :disabled="expanded">
                  <v-icon color="primary">visibility</v-icon>
                </v-btn>
                <span>Unhide task</span>
              </v-tooltip>
              <v-tooltip left v-else>
                <v-btn icon class="mx-0" slot="activator" @click="updateVisibility(props.item)" :disabled="expanded">
                  <v-icon color="error">visibility_off</v-icon>
                </v-btn>
                <span>Hide task</span>
              </v-tooltip>
            </div>
          </td>
        </tr>
      </template>
      <template slot="no-results">
        <div class="text-xs-center">Matching task is not found in the selected month</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import isEqual from 'lodash.isequal'
export default {
  name: 'TimeSheetTable',
  computed: {
    ...mapState('timeSheet', [ 'tasks', 'week', 'daySummary', 'weekSummary', 'pendingTasksResponse' ]),
    headers () {
      let headers = [ ...this.baseTitles, ...this.week, { text: 'Actions', value: 'hidden' } ]
      headers.forEach(key => { key.sortable = !this.expanded })
      return headers
    },
    items () {
      return this.tasks.filter(task => task.hidden ? this.displayHidden : true)
    }
  },
  methods: {
    ...mapActions('timeSheet', [ 'initializeMonth', 'updateTask', 'resetState' ]),
    edit (props) {
      if (!props.expanded) {
        if (isEqual(this.prevProps, this.tempProps)) {
          this.tempProps = { ...props.item }
          this.prevProps = { ...props.item }
          props.expanded = true
          this.expanded = true
        }
      }
    },
    cancel (props) {
      this.tempProps = {}
      this.prevProps = {}
      props.expanded = false
      this.expanded = false
    },
    submit (props) {
      this.updateTask(this.tempProps)
      .then(() => {
        this.tempProps = {}
        this.prevProps = {}
        props.expanded = false
        this.expanded = false
      })
    },
    updateVisibility (item) {
      this.tempProps = { ...item }
      this.tempProps.hidden = !this.tempProps.hidden
      this.updateTask(this.tempProps)
    },
    filterInput (event) {
      const regex = new RegExp('^[0-9.]$')
      if (!regex.test(event.key)) event.preventDefault()
      if (event.key === '.' && event.target.value.includes('.')) event.preventDefault()
      if (event.key !== '.' && !event.target.value.includes('.') && event.target.value.length > 1) event.preventDefault()
      if (event.target.value.charAt(2) === '.' && event.target.value.length > 4) {
        event.preventDefault()
      } else if (event.target.value.charAt(2) !== '.' && event.target.value.length > 3 && event.target.value.includes('.')) {
        event.preventDefault()
      }
    }
  },
  created () {
    this.resetState()
    .then(() => { this.initializeMonth() })
  },
  data: () => ({
    expanded: false,
    displayHidden: false,
    search: '',
    tempProps: {},
    prevProps: {},
    baseTitles: [
      { text: 'Case', value: 'name' },
      { text: 'Description', value: 'description' }
    ]
  })
}
</script>

<style lang="scss" scoped>
.ts-th {
  text-align: left;
  font: {
    size: 1.2em;
    weight: bold;
  }
}
.ts-th_today {
  color: red !important;
}
.ts-td {
  min-width: 100px;
}
.ts-td-description {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ts-input_hours {
  width: 50px;
  max-height: 48px;
  padding-top: 5px;
}
.ts-week-summary {
  font: {
    size: 16px;
    weight: bold;
  }
}
</style>
