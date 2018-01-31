<template lang="html">
  <custom-section v-if="isVerified">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Almost there...
        </h1>
        <h2 class="subtitle">
          You will recieve an SMS shortly
        </h2>
        <p>
          Click to be redirected back to home
        </p>
        <router-link class="button is-large is-success" to="/home">
          Done
        </router-link>
      </div>
    </div>
  </custom-section>
  <div v-else class="container has-text-centered">
    <b-field position="is-centered">
      <b-input class="digit" size="is-large" v-model="digit1" ref="digit1" @input="$refs.digit2.focus()" autofocus></b-input>
      <b-input class="digit" size="is-large" v-model="digit2" ref="digit2" @input="$refs.digit3.focus()"></b-input>
      <b-input class="digit" size="is-large" v-model="digit3" ref="digit3" @input="$refs.digit4.focus()"></b-input>
      <b-input class="digit" size="is-large" v-model="digit4" ref="digit4"></b-input>
    </b-field>
    <button class="button is-large is-info" @click="submit">Verify</button>
  </div>
</template>

<script>
import { API_URL } from '../../../constants'
import customSection from './Section'

export default {
  props: {
    phoneNumber: String,
    id: String
  },

  components: {
    customSection
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
    redirect () {
      this.$router.replace('home')
    },
    async submit () {
      try {
        await fetch(`${API_URL}/prescriptions/${this.id}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: this.phoneNumber,
            verificationCode: `${this.digit1}${this.digit2}${this.digit3}${this.digit4}`
          })
        })
        this.isVerified = true
        this.$toast.open({
          message: 'Successfully subscribed to the medication!',
          type: 'is-success',
          queue: false
        })
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
