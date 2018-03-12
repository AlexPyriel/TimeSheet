<template>
    <v-alert
      :color="color"
      :icon="icon"
      :value="popup.show"
      transition="scale-transition"
      class="ts-response-popup pr-5"
    >
      {{popup.message}}
    </v-alert>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TimeSheetPopup',
  computed: {
    ...mapState('popup', [ 'popup' ]),
    color () { return this.popup.error ? 'error' : 'info' },
    icon () { return this.popup.error ? 'warning' : 'check_circle' }
  }
}
</script>

<style lang="scss" scoped>
.ts-response-popup {
  min-width: 200px;
  font: {
    size: 16px;
    weight: bold;
  }
}
</style>
