<template>
  <v-form v-model="valid" ref="form" lazy-validation  class="ml-5">
    <v-text-field label="Case UID" v-model="name" :rules="nameRules" :counter="10" required></v-text-field>
    <v-text-field label="Case description" v-model="description" :rules="descriptionRules" :counter="100"></v-text-field>
    <v-btn @click="submit()" :loading="pendingAuthResponse" :disabled="submitDisabled" color="primary">create case</v-btn>
    <v-btn @click="clear()" :disabled="pendingAuthResponse">clear</v-btn>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'TimeSheetForm',
  computed: {
    ...mapState('timeSheet', [ 'pendingAuthResponse' ]),
    submitDisabled () {
      return (this.pendingAuthResponse || !this.valid)
    }
  },
  methods: {
    ...mapActions('timeSheet', [ 'submitTask' ]),
    submit () {
      if (this.$refs.form.validate()) {
        const { name, description } = this
        this.submitTask({ name, description })
        .then(() => this.clear())
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Case UID is required',
      v => {
        if (v) {
          return v.length <= 10 || 'Max 10 characters'
        } else { return true }
      }
    ],
    description: '',
    descriptionRules: [
      v => {
        if (v) {
          return v.length <= 100 || 'Max 100 characters'
        } else { return true }
      }
    ]
  })
}
</script>
