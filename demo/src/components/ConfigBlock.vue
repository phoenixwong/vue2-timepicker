<script>
export default {
  name: 'ConfigBlock'
}
</script>

<template lang="pug">
.config-block
  h3.subtitle
    a.anchor #
    slot(name="title")
  slot
</template>

<style lang="stylus">
.config-block
  .subtitle
    margin: 0
    padding: 1em 0 0.5em 0
    position: relative

    a.anchor
      position: absolute
      left: -1em
</style>
