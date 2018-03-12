<template>
  <v-container>
    <v-layout row wrap align-center justify-start>
      <v-date-picker :first-day-of-week="1" v-model="picker" @input="actualizeData(picker)" landscape></v-date-picker>
      <v-flex xs7 md5 lg6 xl5>
        <time-sheet-form></time-sheet-form>
      </v-flex>
      <time-sheet-table></time-sheet-table>
    </v-layout>
  </v-container>
</template>

<script>
import TimeSheetTable from './TimeSheetTable'
import TimeSheetForm from './TimeSheetForm'
import { mapActions } from 'vuex'
export default {
  name: 'TimeSheet',
  components: { TimeSheetTable, TimeSheetForm },
  methods: {
    ...mapActions('timeSheet', [ 'actualizeData' ])
  },
  data: () => ({
    picker: null
  })
}
</script>
