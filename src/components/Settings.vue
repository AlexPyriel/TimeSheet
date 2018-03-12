<template>
  <v-container>
    <v-layout column>
      <v-flex xs12 md6 lg6 xl6>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Toggle application theme</h3>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-switch :label="`Current theme: ${themeLabel}`" v-model="theme" class="ml-3"></v-switch>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Settings',
  computed: {
    ...mapState('theme', [ 'dark' ]),
    theme: {
      get () {
        return this.dark
      },
      set () {
        this.setDark(!this.dark)
      }
    },
    themeLabel () {
      return this.dark ? 'Dark' : 'Light'
    }
  },
  methods: {
    ...mapActions('theme', [ 'setDark' ])
  },
  data: () => ({
  })
}
</script>
