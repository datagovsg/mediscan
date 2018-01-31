<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <!-- <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
      </a> -->
      <a class="navbar-item" href="/">
        <h1 class="title">Mediscan</h1>
      </a>
      <div class="navbar-burger burger" data-target="navbar" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navbar" class="navbar-menu" :class="{'is-active': navIsActive}">
      <!-- <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <a class="bd-tw-button button" data-social-network="Facebook" data-social-action="facebook" data-social-target="/" target="_blank" href="/">
                <span class="icon">
                  <i class="fab fa-twitter"></i>
                </span>
                <span>
                  Facebook
                </span>
              </a>
            </p>
          </div>
        </div>
      </div> -->
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        navIsActive: false
      }
    },
    methods: {
      toggleMenu: function () {
        this.navIsActive = !this.navIsActive
      }
    }
  }
</script>
