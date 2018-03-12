<template>
  <v-container>
    <v-layout column>
      <v-flex  xs12 md8 lg6 xl6>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Pick a file...</h3>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <v-icon slot="activator">info</v-icon>
              <span>Accepted formats: ".xlsx", ".xls"</span>
            </v-tooltip>
          </v-card-title>
          <v-card-actions>
            <input type="file" ref="tenroxFiles" class="ml-3" @change="previewFiles()" multiple accept=".xlsx, .xls" />
          </v-card-actions>
          <v-card-text class="ml-3 pb-0" v-if="files.length > 1">
            <p v-for="file in this.files" :key="file.name">{{file.name}}</p>
          </v-card-text>
          <v-card-actions>
          <v-btn flat color="primary" @click="upload()" :loading="pendingTenroxResponse" :disabled="inputEmtpy">Upload and validate
            <v-icon right>cloud_upload</v-icon>
          </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      
      <v-flex xs12 sm12 md10 lg10 xl8>
        <v-card class="mt-4">
          <v-card-title>
            <h3 class="headline mb-0">Your uploaded files</h3>
          </v-card-title>
          <v-data-table 
            :headers="headers"
            :items="tenrox"
            item-key="name"
            :loading="pendingTenroxResponse"
            class="elevation-1" 
            disable-initial-sort
            hide-actions
          >
            <template slot="headerCell" slot-scope="props">
              <span >{{ props.header.text }}</span>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">{{props.item.contractor}}</td>
                <td class="text-xs-left">{{props.item.from}}</td>
                <td class="text-xs-left">{{props.item.to}}</td>
                <td class="text-xs-left" :class="[props.item.invalid ? 'invalid' : '']">{{props.item.tenrox}}</td>
                <td class="text-xs-left" :class="[props.item.invalid ? 'invalid' : '']">{{props.item.timesheet}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ValidateTenrox',
  computed: {
    ...mapState('tenrox', [ 'tenrox', 'pendingTenroxResponse' ]),
    inputEmtpy () {
      return !!this.files.length <= 0
    }
  },
  methods: {
    ...mapActions('tenrox', [ 'requestTenrox', 'uploadTennrox' ]),
    previewFiles () {
      this.files = this.$refs.tenroxFiles.files
    },
    upload () {
      const data = new FormData()
      for (let file of this.files) {
        data.append('file', file)
      }
      this.uploadTennrox(data)
      .then(() => {
        this.$refs.tenroxFiles.value = ''
        this.files = []
      })
      .catch(() => { this.files = [] })
    }
  },
  data: () => ({
    files: [],
    headers: [
      { text: 'Contractor', value: 'contractor', sortable: false },
      { text: 'From', value: 'from' },
      { text: 'To', value: 'to' },
      { text: 'Tenrox', value: 'tenrox' },
      { text: 'Timesheet', value: 'timesheet' }
    ]
  }),
  created () {
    this.requestTenrox()
  }
}
</script>

<style lang="scss" scoped>
.invalid {
  background-color: #ff5252;
}
</style>
