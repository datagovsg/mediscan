<template lang="html">
  <div class="container has-text-centered">
    <p class="title">I am a</p>
    <p class="title"><button class="button is-large is-primary" @click="patient">Patient</button></p>
    <p class="title"><button class="button is-large is-primary" @click="caregiver">Caregiver</button></p>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String }
  },

  methods: {
    patient () {
      this.$router.push(`/${this.id}/subscribe`)
    },
    caregiver () {
      this.$router.push(`/${this.id}/subscribe`)
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
