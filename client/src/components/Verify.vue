<template lang="html">
  <div v-if="isVerified" class="container has-text-centered">
    <button class="button is-large is-primary" @click="window.close()">Done</button>
  </div>
  <div v-else class="container has-text-centered">
    <b-field position="is-centered">
      <b-input class="digit" size="is-large" v-model="digit1" ref="digit1" @input="$refs.digit2.focus()" autofocus></b-input>
      <b-input class="digit" size="is-large" v-model="digit2" ref="digit2" @input="$refs.digit3.focus()"></b-input>
      <b-input class="digit" size="is-large" v-model="digit3" ref="digit3" @input="$refs.digit4.focus()"></b-input>
      <b-input class="digit" size="is-large" v-model="digit4" ref="digit4"></b-input>
    </b-field>
    <button class="button is-large is-primary" @click="submit">Verify</button>
  </div>
</template>

<script>
import { API_URL } from '../../../constants'

export default {
  props: {
    phoneNumber: { type: String },
    id: { type: String }
  },

  data () {
    return {
      isVerified: false,
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: ''
    }
  },

  methods: {
    async submit () {
      try {
        await fetch(`${API_URL}/prescriptions/${this.id}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: this.phoneNumber,
            verificationCode: `${this.digit1}${this.digit2}${this.digit3}${this
              .digit4}`
          })
        })
        this.$toast.open({
          message: 'Done!',
          type: 'is-success',
          queue: false
        })
        this.isVerified = true
        // this.$router.push(`/${this.id}`)
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
.digit form {
  text-align: center;
}

.digit {
  width: 3em;
  margin: 1em;
}
</style>
