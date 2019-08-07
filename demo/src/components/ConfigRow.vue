<script>
export default {
  name: 'ConfigRow',
  props: {
    label: { type: String },
    isGroup: { type: Boolean, default: false }
  }
}
</script>

<template lang="pug">
.config-row(:class="{'group': isGroup }")
  label.row-label(v-if="this.label && this.label.length") {{ label }}
  slot
</template>

<style lang="stylus">
.config-row
  padding: 0.5em 0
  display: flex
  flex-flow: row wrap
  justify-content: flex-start
  align-items: center
  align-content: flex-start

  .row-label
    display: inline-block
    font-weight: bold
    width: 5em
    text-align: right
    margin-right: 0.5em

  label.options
    min-width: 3em
    margin-right: 0.5em
    display: inline-flex
    flex-flow: row wrap
    justify-content: flex-start
    align-items: center
    position: relative
    input[type=radio],
    input[type=checkbox]
      position: relative
      top: -0.1em


  .range-wrapper
    display: inline-flex
    flex-flow: row nowrap
    justify-content: flex-start
    align-items: center
    input[type=range]
      margin-right: 0.8em

  &.group
    padding-left: 1em
    display: flex
    flex-flow: row wrap
    justify-content: flex-start
    align-items: center
</style>
