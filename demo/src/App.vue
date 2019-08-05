<script>
import Samples from './components/Samples'
import Playground from './components/Playground'

export default {
  name: 'VueTimepickerDemo',

  components: {
    Samples,
    Playground
  },

  data () {
    return {
      currentView: 'samples',
      stickyNav: false,

      scrollHandler: undefined,
      scrollTop: 0
    }
  },

  methods: {
    switchView (target) {
      this.currentView = target
      document.body.scrollTop = 0
    }
  },

  mounted () {
    this.scrollHandler = (evt) => {
      this.scrollTop = (evt.target.scrollingElement || (document.documentElement || document.body.parentNode)).scrollTop || 0
      if (this.scrollTop > 150) {
        this.stickyNav = true
      } else {
        this.stickyNav = false
      }
    }
    window.addEventListener('scroll', this.scrollHandler)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
}
</script>

<template lang="pug">
#app.main-wrapper

  header(v-cloak)
    h1
      | Vue
      span.version 2
      | Timepicker

  nav.top-nav(:class="{stick: stickyNav}")
    span.title
      | Vue
      i 2
      | &nbsp;Timepicker

    ul
      li
        a(:class="{active: currentView === 'samples'}" @click="switchView('samples')") Common Usage
      li
        a(:class="{active: currentView === 'playground'}" @click="switchView('playground')") Playground
      li
        a(href="https://github.com/phoenixwong/vue2-timepicker" target="_blank") Documentation

  main.content(:class="{'nav-affixed': stickyNav}")
    transition(name="fade" mode="out-in")
      component(:is="currentView")

        //- Footer
        template(slot="footer-links")
          h3.title
            a#more.anchor #
            | More complex usage
          .description
            p
              | Didn't find what you need? Please check the&nbsp;
              a(@click="switchView('playground')") Playground
              | &nbsp;or&nbsp;
              a(href="https://github.com/phoenixwong/vue2-timepicker" target="_blank" title="Vue2-Timepicker Documentation") Documentation
              | &nbsp;for more inspiration.
</template>

<style lang="stylus">
@import './assets/demo.styl';
</style>
