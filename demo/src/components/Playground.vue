<script>
import VueTimepicker from '../../../src/vue-timepicker'
import ConfigRow from './ConfigRow'

export default {
  name: 'Playground',
  components: {
    VueTimepicker,
    ConfigRow
  },

  data () {
    return {
      tokens: {
        hour: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
        minute: ['mm', 'm'],
        second: ['ss', 's', 'none'],
        apm: ['A', 'a']
      },

      type: {
        hour: 'hh',
        minute: 'mm',
        second: 'ss',
        apm: 'A'
      },

      selected: {
        hour: 1,
        minute: 0,
        second: 0,
        apm: 'am'
      },

      hourRange: {
        min: 1,
        max: 12
      },

      interval: {
        minute: 1,
        second: 1
      },

      customInterval: {
        minute: false,
        second: false
      },

      enableClearBtn: true,

      disablePicker: false,

      playgroundData: {},
      playgroundFullValue: {},
      playgroundDisplayTime: undefined,

      muteWatch: false,

      scrollTop: 0,
      scrollHandler: undefined
    }
  },

  computed: {
    formatString () {
      let formatString = `${this.type.hour}:${this.type.minute}`
      if (this.type.second !== 'none') {
        formatString += (`:${this.type.second}`)
      }
      if (this.type.apm) {
        formatString += (` ${this.type.apm}`)
      }
      return formatString
    },

    needApm () {
      return this.type.hour === 'h' || this.type.hour === 'hh'
    },

    yourTimeValue () {
      let code = 'yourTimeValue: {\n'
      code += this.listTimeValue()
      code += '\n}'
      return code
    },

    asideStyle () {
      const initPaddingTop = 220
      const minPaddingTop = 50
      return {
        paddingTop: (Math.max(initPaddingTop - this.scrollTop, minPaddingTop)) + 'px'
      }
    },

    htmlCodeWithVar () {
      let start = '<vue-timepicker'
      let end = '\n  v-model="yourTimeValue">\n</vue-timepicker>'

      start += (`\n  format="${this.formatString}"`)

      if (this.customInterval.minute) {
        start += (`\n  :minute-interval="${this.interval.minute}"`)
      }

      if (this.customInterval.second) {
        start += (`\n  :second-interval="${this.interval.second}"`)
      }

      if (!this.enableClearBtn) {
        start += ('\n  hide-clear-button')
      }

      if (this.disablePicker) {
        start += ('\n  disabled')
      }

      const htmlCode = start + end

      return htmlCode
    }
  },


  watch: {
    selected: {
      deep: true,
      handler: 'updatePlaygroundData'
    },

    type: {
      deep: true,
      handler: 'updatePlaygroundData'
    },

    needApm (isNeeded) {
      if (isNeeded) {
        if (!this.selected.apm) {
          this.$set(this.type, 'apm', 'A')
          this.$set(this.selected, 'apm', 'am')
        }
      } else {
        this.$set(this.type, 'apm', '')
        this.$set(this.selected, 'apm', '')
      }
    },

    customInterval: {
      deep: true,
      handler (custom) {
        if (!custom.minute) {
          this.$set(this.interval, 'minute', 1)
        }
        if (!custom.second) {
          this.$set(this.interval, 'second', 1)
        }
      }
    }
  },

  methods: {
    updateHourRange (hourType) {
      hourType = hourType || this.type.hour
      let hourRange = {}
      switch (hourType) {
        case 'h':
        case 'hh':
          hourRange.min = 1
          hourRange.max = 12
          break
        case 'H':
        case 'HH':
          hourRange.min = 0
          hourRange.max = 23
          break
        case 'k':
        case 'kk':
          hourRange.min = 1
          hourRange.max = 24
          break
      }
      this.hourRange = hourRange
      this.handleOutRangeData()
    },

    handleOutRangeData () {
      if (this.selected.hour > this.hourRange.max) {
        this.$set(this.selected, 'hour', this.hourRange.max)
      } else if (this.selected.hour < this.hourRange.min) {
        this.$set(this.selected, 'hour', this.hourRange.min)
      }
    },

    formatValue (type, value) {
      switch (type) {
        case 'H':
        case 'h':
        case 'k':
        case 'm':
        case 's':
          return String(value)
        case 'HH':
        case 'hh':
        case 'kk':
        case 'mm':
        case 'ss':
          return value < 10 ? `0${value}` : String(value)
        default:
          return ''
      }
    },

    updatePlaygroundData () {
      if (this.muteWatch) { return }

      let data = {}
      data[this.type.hour] = this.formatValue(this.type.hour, this.selected.hour)
      data[this.type.minute] = this.formatValue(this.type.minute, this.selected.minute)

      if (this.type.second !== 'none') {
        data[this.type.second] = this.formatValue(this.type.second, this.selected.second || 0)
      }

      if (this.type.apm) {
        data[this.type.apm] = this.type.apm === 'A' ? (this.selected.apm).toUpperCase() : this.selected.apm
      }

      this.playgroundData = data
    },

    listTimeValue () {
      const data = this.playgroundData
      const len = Object.keys(data).length
      let string = ''
      Object.keys(data).forEach((k, i) => {
        string += `  ${k}: "${data[k]}"`
        if (i < len - 1) {
          string += '\n'
        }
      })
      return string
    },

    updateRangeValue (data) {
      this.muteWatch = true
      this.$set(this.selected, 'hour', Number(data[this.type.hour]))
      this.$set(this.selected, 'minute', Number(data[this.type.minute]))
      this.$set(this.selected, 'second', Number(data[this.type.second]))
      this.$set(this.selected, 'apm', (data[this.type.apm] || '').toLowerCase())
      this.muteWatch = false
    },

    changeHandler (eventData) {
      this.playgroundFullValue = eventData.data
      this.playgroundDisplayTime = eventData.displayTime
      this.updateRangeValue(eventData.data)
    }
  },

  mounted () {
    this.scrollHandler = (evt) => {
      this.scrollTop = (evt.target.scrollingElement || (document.documentElement || document.body.parentNode)).scrollTop || 0
    }
    window.addEventListener('scroll', this.scrollHandler)

    this.$nextTick(() => {
      this.updateHourRange()
      this.updatePlaygroundData()
    })
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
}
</script>

<template lang="pug">
section#playground
  main
    h2.section-title Timepicker Playground

    #configPanel
      #typesSelection.config-block
        h3.subtitle
          a.anchor #
          | Generate&nbsp;
          code format
          | &nbsp;string
        config-row(label="Hour:")
          label.options(v-for="(htype, index) in tokens.hour", :key="index", :for="'hour_type' + index" @mouseup.stop="updateHourRange(htype)")
            input(v-model="type.hour", :value="htype", :id="'hour_type' + index" type="radio" name="hour_type")
            | &nbsp;{{ htype }}
        config-row(label="Minute:")
          label.options(v-for="(mtype, index) in tokens.minute", :key="index", :for="'minute_type' + index")
            input(v-model="type.minute", :value="mtype", :id="'minute_type' + index" type="radio" name="minute_type")
            | &nbsp;{{ mtype }}
        config-row(label="Second:")
          label.options(v-for="(stype, index) in tokens.second", :key="index", :for="'second_type' + index")
            input(v-model="type.second", :value="stype", :id="'second_type' + index" type="radio" name="second_type")
            | &nbsp;{{ stype }}
        config-row(v-if="needApm" label="AM/PM:")
          label.options(v-for="(atype, index) in tokens.apm", :key="index", :for="'apm_type' + index")
            input(v-model="type.apm", :value="atype", :id="'apm_type' + index" type="radio" name="apm_type")
            | &nbsp;{{ atype }}

      #intervalSelection.config-block
        h3.subtitle
          a.anchor #
          | Customized Interval
        config-row(is-group)
          label.options
            input(v-model="customInterval.minute" type="checkbox")
            | &nbsp;Minute Interval
          label.range-wrapper(v-if="customInterval.minute")
            input(v-model.number="interval.minute" type="range" min="0" max="60" step="1")
            span(v-text="interval.minute")
        config-row(is-group)
          label.options
            input(v-model="customInterval.second" type="checkbox")
            | &nbsp;Second Interval
          label.range-wrapper(v-if="customInterval.second")
            input(v-model.number="interval.second" type="range" min="0" max="60" step="1")
            span(v-text="interval.second")

      #clearButton.config-block
        h3.subtitle
          a.anchor #
          | Clear Button
        config-row(is-group)
          label.options(for="enable_btn_true")
            input(v-model="enableClearBtn" type="radio" id="enable_btn_true" name="enable_btn", :value="true")
            | &nbsp;Enable
          label.options(for="enable_btn_false")
            input(v-model="enableClearBtn" type="radio" id="enable_btn_false" name="enable_btn", :value="false")
            | &nbsp;Disable

      #disablePicker.config-block
        h3.subtitle
          a.anchor #
          | Disable Picker
        config-row
          label.options
            input(v-model="disablePicker" type="checkbox")
            | &nbsp;Disable

      #valuesSelection.config-block
        h3.subtitle
          a.anchor #
          | Set&nbsp;
          code v-model
          | &nbsp;data
        config-row(label="Hour:")
          label.range-wrapper
            input(v-model="selected.hour" type="range", :min="hourRange.min", :max="hourRange.max" step="1")
            span(v-text="selected.hour")
        config-row(label="Minute:")
          label.range-wrapper
            input(v-model="selected.minute" type="range" min="0" max="59", :step="interval.minute")
            span(v-text="selected.minute")
        config-row(v-if="type.second !== 'none'" label="Second:")
          label.range-wrapper
            input(v-model="selected.second" type="range" min="0" max="59", :step="interval.second")
            span(v-text="selected.second")
        config-row(v-if="needApm" label="AM/PM:", :class="{'capitailized': type.apm === 'A'}")
          label.options(for="selected_apm_am")
            input(v-model="selected.apm" type="radio" id="selected_apm_am" name="selected_apm" value="am")
            | &nbsp;am
          label.options(for="selected_apm_pm")
            input(v-model="selected.apm" type="radio" id="selected_apm_pm" name="selected_apm" value="pm")
            | &nbsp;pm

      .codes
        highlight-code(lang="javascript" data-title="v-model value") {{ yourTimeValue }}

  aside.previews(:style="asideStyle")
    #playgroundPreview.preview
      b Format string:&nbsp;
      span(v-text="formatString")
      p
        vue-timepicker(v-model="playgroundData"
                       :format="formatString"
                       :minute-interval="interval.minute"
                       :second-interval="interval.second"
                       :hide-clear-button="!enableClearBtn"
                       :disabled="disablePicker"
                       @change="changeHandler")

    #htmlCodePreview.codes
      highlight-code(lang="html" data-title="HTML") {{ htmlCodeWithVar }}

    #dispatchedValue.codes
      highlight-code(lang="json" data-title="@change event data") {{ playgroundFullValue }}
      highlight-code(lang="json" data-title="@change event displayTime") {{ playgroundDisplayTime }}
</template>

<style lang="stylus">
section#playground
  main
    padding-left: 420px
    .codes
      pre,
      code
        overflow-x: auto

  .config-block
    .subtitle
      margin: 0
      padding: 1em 0 0.5em 0
      position: relative

      a.anchor
        position: absolute
        left: -1em

    &:first-of-type
      .subtitle
        padding-top: 0

  aside.previews
    position: fixed
    width: 320px
    left:10%
    top: 0
    z-index: 10
    padding-top: 220px

  #playgroundPreview
    box-sizing: border-box
    background: #fff
</style>
