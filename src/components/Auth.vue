<template>
  <v-container fluid fill-height class="auth__background">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12 auth__form" dark>
          <v-card-text class="pb-0">
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                v-model="username"
                prepend-icon="person"
                name="username"
                label="Username"
                type="text"
                required
                :rules="[v => !!v || 'Username is required']"
                @input.once="forget()"
              ></v-text-field>
              <v-text-field
                v-model="password"
                prepend-icon="lock"
                name="password"
                label="Password"
                :append-icon="passHidden ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (passHidden = !passHidden)"
                :type="passHidden ? 'password' : 'text'"
                :rules="[v => !!v || 'Password is required']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-checkbox
              label="Remember me"
              v-model="rememberMe"
              hide-details
            ></v-checkbox>
          </v-card-actions>
          <v-card-actions>
            <v-btn block color="primary" @click="login()" :loading="pendingResponse">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Auth',
  computed: {
    ...mapState('auth', [ 'pendingResponse' ])
  },
  methods: {
    ...mapActions('auth', [ 'authRequest' ]),
    login () {
      if (this.$refs.form.validate()) {
        const { username, password } = this
        this.authRequest({ username, password })
        .then(() => {
          if (this.rememberMe) {
            localStorage.setItem('rememberMe', this.username)
          } else {
            localStorage.removeItem('rememberMe')
          }
          this.$refs.form.reset()
          this.$router.push('/')
        })
        .catch(() => {
          this.forget()
          this.$refs.form.reset()
        })
      }
    },
    forget () {
      localStorage.removeItem('rememberMe')
      this.rememberMe = false
    }
  },
  data: () => ({
    rememberMe: false,
    valid: true,
    passHidden: true,
    username: localStorage.getItem('rememberMe') || '',
    password: ''
  }),
  created () {
    this.rememberMe = !!this.username
  }
}
</script>

<style lang="scss">
.auth__background {
  background: url('../../static/krd.jpeg') no-repeat center center fixed;
}
.auth__form {
  opacity: .8;
}
</style>
