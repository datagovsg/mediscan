<template lang="html">
  <section v-bind:class="sectionClass">
    <slot>
      <!-- This will only be displayed if there is no content to be distributed. -->
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{title}}
          </h1>
          <h2 class="subtitle">{{subtitle}}
          </h2>
        </div>
      </div>
    </slot>
  </section>
</template>

<script>
export default {
  props: {
    sectionClass: [Array, String],
    title: String,
    subtitle: String
  }
}
</script>

