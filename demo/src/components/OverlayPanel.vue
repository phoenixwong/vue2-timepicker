<script>
export default {
  name: 'OverlayPanel',
  props: {
    title: { type: String }
  },
  methods: {
    closePanel () {
      this.$emit('close')
    }
  }
}
</script>

<template lang="pug">
.overlay-panel(@click="closePanel")
  .panel-body(@click.stop="")
    .panel-title
      .title-text(v-if="title" v-text="title")
      .close-btn(@click="closePanel") &times;
    .panel-content
      slot
    .panel-footer
      .footer-left
        slot(name="footerLeft")
      .footer-right
        slot(name="footerRight")
</template>

<style lang="stylus">
@import '../assets/_variables.styl'

.overlay-panel
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: -black(0.7)
  z-index: 5000

  display: flex
  flex-flow: column nowrap
  justify-content: center
  align-items: center

  .panel-body
    width: 500px
    max-width: 80vw
    max-height: 70vh
    min-height: 200px
    background: #fff
    border-radius: 6px
    box-shadow: 0 .1em 0.5em -black(0.35)

    display: flex
    flex-flow: column nowrap
    justify-content: flex-start
    align-items: stretch

    .panel-title
      display: flex
      flex-flow: row nowrap
      justify-content: flex-end
      align-items: center
      padding: 0.6em 0.8em 0.5em 0.8em
      border-bottom: 1px solid -black(0.1)

      .title-text
        flex: 1 1 0.00001px
        color: $vue-dark
        line-height: 120%
        font-weight: bold
        font-size: 1.2em
      
      .close-btn
        margin-left: 1em
        font-size: 1.2em
        line-height: 100%
        position: relative
        top: -.2em
        cursor: pointer
        transition: opacity .3s
        &:hover
          opacity: 0.4

    .panel-content
      flex: 1 1 0.00001px
      padding: 1em 0.8em
    
    .panel-footer
      border-top: 1px solid -black(0.1)
      padding: 0.5em 0.6em 0.5em 0.8em
      display: flex
      flex-flow: row nowrap
      justify-content: flex-start
      align-items: center

      .footer-left
        flex: 1 1 0.00001px
        button:not(:first-of-type)
          margin-left: 0.6em
</style>
