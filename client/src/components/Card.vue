<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{title}}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <p>
          {{subtitle}}
        </p>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: String
  }
}
</script>

