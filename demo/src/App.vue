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

      scrollTop: 0
    }
  },

  methods: {
    switchView (target) {
      try {
        history.replaceState(null, null, ' ')
      } catch (e) {
        // Failsafe for outdated browsers. Do nothing here.
      }
      this.currentView = target
      this.$nextTick(() => {
        if (document.documentElement && document.documentElement.scrollTop) {
          document.documentElement.scrollTop = 0
        } else if (document.body.parentNode && document.body.parentNode.scrollTop) {
          document.body.parentNode.scrollTop = 0
        } else {
          document.body.scrollTop = 0
        }
      })
    },

    scrollHandler (evt) {
      this.scrollTop = (evt.target.scrollingElement || (document.documentElement || document.body.parentNode)).scrollTop || 0
      if (this.scrollTop > 150) {
        if (!this.stickyNav) {
          this.stickyNav = true
        }
      } else {
        if (this.stickyNav) {
          this.stickyNav = false
        }
      }
    }
  },

  mounted () {
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
        a(href="https://github.com/phoenixwong/vue2-timepicker/blob/master/README.md" target="_blank") Documentation

    span.version
      a(href="https://www.npmjs.com/package/vue2-timepicker" target="_blank")
        img(alt="NPM latest version" src="https://img.shields.io/npm/v/vue2-timepicker?style=flat-square")
    span.downloads
      a(href="https://www.npmjs.com/package/vue2-timepicker" target="_blank")
        img(alt="NPM downloads" src="https://img.shields.io/npm/dm/vue2-timepicker?style=flat-square")

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
              a(href="https://github.com/phoenixwong/vue2-timepicker/blob/master/README.md" target="_blank" title="Vue2-Timepicker Documentation") Documentation
              | &nbsp;for more inspiration.
</template>

<style lang="stylus">
@import './assets/demo.styl';
</style>
