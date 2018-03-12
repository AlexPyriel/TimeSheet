<template>
  <v-container>
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">Status</h3>
      </v-card-title>
      <v-card-actions>
        <v-btn @click="requestStatus()" :loading="pendingStatusResponse" color="primary">Refresh status <v-icon right>cached</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-actions>
      <v-data-table 
        :headers="headers"
        :items="status"
        item-key="name"
        :search="search"
        :loading="pendingStatusResponse"
        class="elevation-1" 
        disable-initial-sort
        :rows-per-page-items="[10, 25, { text: 'All', value:-1 }]"
      >
        <template slot="headerCell" slot-scope="props">
          <span >{{ props.header.text }}</span>
        </template>
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-left">{{props.item.developer}}</td>
            <td class="text-xs-left">{{props.item.name}}</td>
            <td class="text-xs-left">{{props.item.description}}</td>
            <td class="text-xs-left">{{props.item.remaining}}</td>
            <td class="text-xs-left">{{props.item.progress}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Status',
  computed: {
    ...mapState('status', [ 'status', 'pendingStatusResponse' ])
  },
  methods: {
    ...mapActions('status', [ 'requestStatus' ])
  },
  data: () => ({
    search: '',
    headers: [
      { text: 'Developer', value: 'developer' },
      { text: 'Case', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Remaining', value: 'remaining' },
      { text: 'Progress', value: 'progress' }
    ]
  }),
  created () {
    this.requestStatus()
  }
}
</script>
