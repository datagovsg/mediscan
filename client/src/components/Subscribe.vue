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
import { API_URL } from '../../../constants'

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
    async submit () {
      try {
        await fetch(`${API_URL}/prescriptions/${this.id}/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: this.phoneNumber
          })
        })
        this.$toast.open({
          message: 'Done!',
          type: 'is-success',
          queue: false
        })
        this.$router.push(`verify/${this.phoneNumber}`)
      } catch (e) {
        this.$toast.open({
          message: e,
          type: 'is-danger',
          queue: false
        })
      }
    }
  }
}
</script>

<style lang="css">

</style>
