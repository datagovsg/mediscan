<template lang="html">
  <div class="container has-text-centered">
    <b-field position="is-centered">
      <p class="control">
        <span class="button is-large is-static">+65</span>
      </p>
      <b-input size="is-large" v-model="phoneNumber"></b-input>
    </b-field>
    <button class="button is-large is-primary" @click="submit">Remind me!</button>
  </div>
</template>

<script>
import { API_URL } from '../constants'

export default {
  props: {
    id: { type: String }
  },

  data () {
    return {
      phoneNumber: ''
    }
  },

  methods: {
    submit () {
      fetch(`${API_URL}/prescriptions/${this.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: this.phoneNumber
        })
      })
    }
  }
}
</script>

<style lang="css">

</style>
