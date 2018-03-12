<template>
  <v-app id="app" :dark="dark">
    <v-navigation-drawer clipped fixed v-model="drawer" app absolute v-if="isAuthenticated">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon large>face</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{user.username}}</v-list-tile-title>
              <v-list-tile-title>{{user.fullname}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" @click="routeTo(item.path)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" :disabled="!isAuthenticated"></v-toolbar-side-icon>
      <v-toolbar-title>TimeSheet Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <time-sheet-popup></time-sheet-popup>
      <div v-if="isAuthenticated">
        <v-tooltip left>
          <v-btn icon slot="activator" @click="logout">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
          <span>Logout</span>
        </v-tooltip>
      </div>
    </v-toolbar>
    
    <v-content>
      <transition name="slide-fade">
        <router-view/>
      </transition>
    </v-content>
    
    <v-footer app fixed>
      <span class="ml-5">AlexPyriel&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import TimeSheetPopup from './components/TimeSheetPopup'

export default {
  name: 'app',
  components: { TimeSheetPopup },
  data () {
    return {
      drawer: null,
      items: [
          { title: 'TimeSheet', icon: 'today', path: '/' },
          { title: 'View Report', icon: 'assignment', path: '/ViewReport' },
          { title: 'Status', icon: 'subject', path: '/Status' },
          { title: 'Validate Tennrox', icon: 'assignment_turned_in', path: '/ValidateTennrox' },
          { title: 'Settings', icon: 'settings', path: '/Settings' }
      ]
    }
  },
  computed: {
    ...mapState('theme', [ 'dark' ]),
    ...mapState('auth', [ 'user' ]),
    ...mapGetters('auth', [ 'isAuthenticated' ])
  },
  methods: {
    ...mapActions('interceptor', [ 'initInterceptor' ]),
    ...mapActions('auth', [ 'authLogout', 'initAuth' ]),
    routeTo (path) {
      this.$router.push(path)
    },
    logout: function () {
      this.authLogout()
      .then(() => {
        this.$router.push('/login')
      })
    }
  },
  created () {
    this.initInterceptor()
    this.initAuth()
  }
}
</script>

<style lang="scss" scoped>
  @media only screen and (min-width: 1904px) {
    .container {
        max-width: 1185px;
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(100px);
    opacity: 0;
  }
</style>
