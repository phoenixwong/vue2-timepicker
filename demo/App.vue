<script>
import Samples from 'components/Samples.vue'
import Playground from 'components/Playground.vue'

var scrollHandler

export default {
  name: 'App',
  components: {
    'samples': Samples,
    'playground': Playground
  },

  data () {
    return {
      currentView: 'samples',
      scrollTop: 0,
      highlightDebouncer: undefined
    }
  },

  methods: {
    switchView (target) {
      this.currentView = target
      document.body.scrollTop = 0
    },

    debounceRefreshHighlight () {
      clearTimeout(this.highlightDebouncer)
      const self = this
      this.highlightDebouncer = setTimeout(() => {
        clearTimeout(self.highlightDebouncer)
        self.refreshAllHighlight()
      }, 200)
    },

    refreshAllHighlight () {
      if (!this.$el) { return }
      const codeBlocks = this.$el.querySelectorAll('pre code')
      Array.prototype.forEach.call(codeBlocks, (block) => {
        window.hljs.highlightBlock(block)
      })
    }
  },

  mounted () {
    const self = this
    scrollHandler = (evt) => {
      self.scrollTop = (evt.target.scrollingElement || (document.documentElement || document.body.parentNode)).scrollTop || 0
      self.debounceRefreshHighlight()
    }
    window.addEventListener('scroll', scrollHandler)
  },

  beforeDestroy () {
    clearTimeout(this.highlightDebouncer)
    window.removeEventListener('scroll', scrollHandler)
  }
}
</script>

<template>
  <div class="main-wrapper">
    <header v-cloak>
      <h1>Vue<span class="version">2</span> Timepicker</h1>
      <p>A dropdown time picker for <span class="version">Vue 2.x</span> with flexible time format support</p>
    </header>
    <nav class="top-nav" :class="{stick: scrollTop > 150}">
      <span class="title">Vue<i>2</i> Timepicker</span>
      <ul>
        <li><a @click="switchView('samples')" :class="{active: currentView === 'samples'}">Common Usage</a></li>
        <li><a @click="switchView('playground')" :class="{active: currentView === 'playground'}">Playground</a></li>
        <li><a href="https://github.com/phoenixwong/vue2-timepicker" target="_blank">Documentation</a></li>
      </ul>
      <span class="v1x"><a href="https://phoenixwong.github.io/vue-timepicker/" target="_blank">Vue 1.x Version</a> &raquo;</span>
    </nav>
    <main class="content" :class="{'nav-affixed': scrollTop > 150}">
      <transition name="fade" mode="out-in">
        <component :is="currentView">
          <div slot="footer-links">
            <h3 class="title"><a class="anchor" id="more">#</a>More complex usage</h3>
            <div class="description">
              <p>Didn't find what you need? Please check the <a @click="switchView('playground')">Playground</a> or <a href="https://github.com/phoenixwong/vue2-timepicker" target="_blank" title="Vue2-Timepicker Documentation">Documentation</a> for more inspiration.</p>
            </div>
          </div>
        </component>
      </transition>
    </main>
  </div>
</template>

<style lang="sass">
@import "./assets/demo.scss";
</style>
