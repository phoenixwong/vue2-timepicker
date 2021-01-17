<script>
import VueTimepicker from '../../../src/vue-timepicker'
import ConfigRow from './ConfigRow'
import OverlayPanel from './OverlayPanel'

export default {
  name: 'Playground',
  components: {
    VueTimepicker,
    ConfigRow,
    OverlayPanel
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

      hourBoundary: {
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

      customRange: {
        hour: false,
        minute: false,
        second: false
      },
      showRangePanel: false,
      rangeList: undefined,
      editingRange: '',
      selectedRanges: [],
      rangeTitle: '',

      hourRange: [],
      minuteRange: [],
      secondRange: [],

      hideClearBtn: false,
      disablePicker: false,
      closeOnComplete: false,
      advancedKeyboard: false,
      manualInput: false,
      hideDropdown: false,
      fixedDropdownBtn: false,
      lazyMode: false,
      autoScroll: false,
      skipErrorStyle: false,
      appendToBody: false,
      debugMode: false,

      customBlurDelay: false,
      blurDelay: 300,

      customManualInputTimeout: false,
      manualInputTimeout: 1000,

      playgroundData: {},
      playgroundFullValue: {},
      playgroundErroredData: undefined,

      scrollTop: 0,

      muteChange: false
    }
  },

  computed: {
    formatString () {
      let formatString = `${this.type.hour}:${this.type.minute}`
      if (this.showSeconds) {
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

    showSeconds () {
      return this.type.second !== 'none'
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

    filteredOutValues () {
      if (!this.showRangePanel || !this.rangeList || !this.selectedRanges.length) { return }
      const result = []
      this.selectedRanges.forEach(selected => {
        if (selected && !this.rangeList.includes(selected)) {
          result.push(selected)
        }
      })
      return result
    },

    toHideDropdown () {
      if (!this.manualInput) { return false }
      return this.hideDropdown
    },

    showErroredData () {
      return Boolean(this.playgroundErroredData && this.playgroundErroredData.length)
    },

    htmlCodeWithVar () {
      let start = '<vue-timepicker'
      let end = '\n  v-model="yourTimeValue">\n</vue-timepicker>'

      start += (`\n  format="${this.formatString}"`)

      if (this.skipErrorStyle) {
        start += ('\n  input-class="skip-error-style"')
      }

      if (this.customInterval.minute) {
        start += (`\n  :minute-interval="${this.interval.minute}"`)
      }

      if (this.showSeconds && this.customInterval.second) {
        start += (`\n  :second-interval="${this.interval.second}"`)
      }

      if (this.customRange.hour && this.hourRange) {
        const hrRange = this.sortAndStringify(this.hourRange, this.needApm)
        start += (`\n  :hour-range="${hrRange}"`)
      }

      if (this.customRange.minute && this.minuteRange) {
        const minRange = this.sortAndStringify(this.minuteRange)
        start += (`\n  :minute-range="${minRange}"`)
      }

      if (this.showSeconds && this.customRange.second && this.secondRange) {
        const secRange = this.sortAndStringify(this.secondRange)
        start += (`\n  :second-range="${secRange}"`)
      }

      if (this.customBlurDelay) {
        start += (`\n  :blur-delay="${this.blurDelay}"`)
      }

      if (this.customManualInputTimeout) {
        start += (`\n  :manual-input-timeout="${this.manualInputTimeout}"`)
      }

      if (this.lazyMode) {
        start += ('\n  lazy')
      }

      if (this.closeOnComplete) {
        start += ('\n  close-on-complete')
      }

      if (this.manualInput) {
        start += ('\n  manual-input')
      }

      if (this.toHideDropdown) {
        start += ('\n  hide-dropdown')
      }

      if (this.advancedKeyboard) {
        start += ('\n  advanced-keyboard')
      }

      if (this.fixedDropdownBtn) {
        start += ('\n  fixed-dropdown-button')
      }

      if (this.hideClearBtn) {
        start += ('\n  hide-clear-button')
      }

      if (this.autoScroll) {
        start += ('\n  auto-scroll')
      }

      if (this.appendToBody) {
        start += ('\n  append-to-body')
      }

      if (this.disablePicker) {
        start += ('\n  disabled')
      }

      if (this.debugMode) {
        start += ('\n  debug-mode')
      }

      const htmlCode = start + end

      return htmlCode
    }
  },

  watch: {
    selected: {
      deep: true,
      handler () {
        this.updatePlaygroundData()
      }
    },

    type: {
      deep: true,
      handler () {
        this.updatePlaygroundData()
      }
    },

    'type.hour' (newType, oldType) {
      if (this.customRange.hour && this.hourRange.length) {
        const newRangeList = this.hourRange.map(item => {
          return this.transformHourRange(item, oldType, newType)
        })
        this.hourRange = newRangeList
      }
    },

    'type.minute' (newType) {
      if (this.customRange.minute && this.minuteRange.length) {
        const newRangeList = this.minuteRange.map(item => {
          return this.formatValue(newType, +item)
        })
        this.minuteRange = newRangeList
      }
    },

    'type.second' (newType) {
      if (newType !== 'none' && this.customRange.second && this.secondRange.length) {
        const newRangeList = this.secondRange.map(item => {
          return this.formatValue(newType, +item)
        })
        this.secondRange = newRangeList
      }
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
      let hourBoundary = {}
      switch (hourType) {
        case 'h':
        case 'hh':
          hourBoundary.min = 1
          hourBoundary.max = 12
          break
        case 'H':
        case 'HH':
          hourBoundary.min = 0
          hourBoundary.max = 23
          break
        case 'k':
        case 'kk':
          hourBoundary.min = 1
          hourBoundary.max = 24
          break
      }
      this.hourBoundary = hourBoundary
      this.handleOutRangeData()
    },

    handleOutRangeData () {
      if (this.selected.hour > this.hourBoundary.max) {
        this.$set(this.selected, 'hour', this.hourBoundary.max)
      } else if (this.selected.hour < this.hourBoundary.min) {
        this.$set(this.selected, 'hour', this.hourBoundary.min)
      }
    },

    isNumber (value) {
      return !isNaN(parseFloat(value)) && isFinite(value)
    },

    formatValue (type, value) {
      switch (type) {
        case 'H':
        case 'h':
        case 'k':
        case 'm':
        case 's':
          if (type === 'h' && value === 0) {
            return '12'
          }
          return String(value)
        case 'HH':
        case 'hh':
        case 'kk':
        case 'mm':
        case 'ss':
          if (type === 'hh' && value === 0) {
            return '12'
          }
          return value < 10 ? `0${value}` : String(value)
        default:
          return ''
      }
    },

    translate12hRange (value) {
      const valueT = value.match(/^(\d{1,2})(a|p|A|P)$/)
      if (+valueT[1] === 12) {
        return +valueT[1] + (valueT[2].toLowerCase() === 'p' ? 0 : 12)
      }
      return +valueT[1] + (valueT[2].toLowerCase() === 'p' ? 12 : 0)
    },

    interpretKtoRangeType (kValue, toType) {
      if (!toType || toType === 'k') { return String(kValue) }
      let value
      switch (toType) {
        case 'H':
        case 'HH':
          value = (kValue === 24) ? 0 : kValue
          if (toType === 'HH') {
            return value < 10 ? `0${value}` : String(value)
          }
          return String(value)
        case 'h':
        case 'hh':
          if (kValue === 24) {
            return `12a`
          } else if (kValue === 12) {
            return `12p`
          }
          value = kValue % 12
          if (toType === 'hh') {
            const valueStr = value < 10 ? `0${value}` : String(value)
            return kValue < 12 ? `${valueStr}a` : `${valueStr}p`
          }
          return kValue < 12 ? `${value}a` : `${value}p`
        case 'kk':
          return kValue < 10 ? `0${kValue}` : String(kValue)
      }
    },

    transformHourRange (value, fromType, toType) {
      if (!fromType || !toType) { return value }
      let valueInK
      if (fromType === 'hh' || fromType === 'h') {
        valueInK = this.translate12hRange(value)
      } else if (fromType === 'HH' || fromType === 'H') {
        valueInK = +value === 0 ? 24 : +value
      } else {
        valueInK = +value
      }
      return this.interpretKtoRangeType(valueInK, toType)
    },

    updatePlaygroundData () {
      let data = {}

      if (this.isNumber(this.selected.hour)) {
        data[this.type.hour] = this.formatValue(this.type.hour, this.selected.hour)
      } else {
        data[this.type.hour] = ''
      }

      if (this.isNumber(this.selected.minute)) {
        data[this.type.minute] = this.formatValue(this.type.minute, this.selected.minute)
      } else {
        data[this.type.minute] = ''
      }

      if (this.showSeconds) {
        if (this.isNumber(this.selected.second)) {
          data[this.type.second] = this.formatValue(this.type.second, this.selected.second)
        } else {
          data[this.type.second] = ''
        }
      }

      if (this.type.apm) {
        if (this.selected.apm) {
          data[this.type.apm] = this.type.apm === 'A' ? (this.selected.apm).toUpperCase() : this.selected.apm
        } else {
          data[this.type.apm] = ''
        }
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
      this.muteChange = true
      this.$set(this.selected, 'hour', this.isNumber(data[this.type.hour]) ? Number(data[this.type.hour]) : '')
      this.$set(this.selected, 'minute', this.isNumber(data[this.type.minute]) ? Number(data[this.type.minute]) : '')
      this.$set(this.selected, 'second', this.isNumber(data[this.type.second]) ? Number(data[this.type.second]) : '')
      this.$set(this.selected, 'apm', data[this.type.apm] ? (data[this.type.apm] || '').toLowerCase() : '')
      this.muteChange = false
    },

    changeHandler (eventData) {
      this.playgroundFullValue = eventData
      this.updateRangeValue(eventData.data)
    },

    errorHandler (eventData) {
      this.playgroundErroredData = eventData
    },

    scrollHandler (evt) {
      this.scrollTop = (evt.target.scrollingElement || (document.documentElement || document.body.parentNode)).scrollTop || 0
    },

    sortAndStringify (arrayList, is12Hour) {
      if (!arrayList || !arrayList.length) { return JSON.stringify([]) }
      let newList = [].concat([], arrayList)
      if (is12Hour) {
        newList.sort((l, r) => {
          const lPart = l.match(/^(\d{1,2})(a|p)$/)
          const rPart = r.match(/^(\d{1,2})(a|p)$/)
          const lApm = lPart[2]
          const rApm = rPart[2]
          if (lApm === 'a' && rApm === 'p') { return -1 }
          if (lApm === 'p' && rApm === 'a') { return 1 }
          const lNum = +lPart[1]
          const rNum = +rPart[1]
          if (lNum === 12) { return -1 }
          if (rNum === 12) { return 1 }
          return lNum < rNum ? -1 : 1
        })
        const uniStrList = newList.map(item => {
          const itemP = item.match(/^(\d{1,2})(a|p)$/)
          return `${+itemP[1]}${itemP[2]}`
        })
        return JSON.stringify(uniStrList).replace(/"/g, '\'')
      } else {
        newList.sort((l, r) => (+l < +r) ? -1 : 1)
        const numericList = newList.map(item => +item)
        return JSON.stringify(numericList).replace(/"/g, '')
      }
    },

    genHourRangeList () {
      const result = []
      for (let i = 0; i < 24; i++) {
        // 12-Hour format
        if (this.type.hour === 'h' || this.type.hour === 'hh') {
          let value = this.formatValue(this.type.hour, i % 12)
          value = `${value}${i < 12 ? 'a' : 'p'}`
          result.push(value)
        } else {
          if (this.type.hour === 'k' || this.type.hour === 'kk') {
            result.push(this.formatValue(this.type.hour, i + 1))
          } else {
            result.push(this.formatValue(this.type.hour, i))
          }
        }
      }
      return result
    },

    genMinuteRangeList () {
      const result = []
      const step = +this.interval.minute
      for (let i = 0; i <= 59; i += step) {
        result.push(this.formatValue(this.type.minute, i))
      }
      return result
    },

    genSecondRangeList () {
      const result = []
      const step = +this.interval.second
      for (let i = 0; i <= 59; i += step) {
        result.push(this.formatValue(this.type.second, i))
      }
      return result
    },

    openRangePanel (section) {
      if (!section) { return }

      this.rangeTitle = `Choose ${section}-range Values`
      this.editingRange = section

      if (section === 'minute') {
        this.rangeList = this.genMinuteRangeList()
        this.selectedRanges = [].concat([], this.minuteRange)
      } else if (section === 'second') {
        this.rangeList = this.genSecondRangeList()
        this.selectedRanges = [].concat([], this.secondRange)
      } else if (section === 'hour') {
        this.rangeList = this.genHourRangeList()
        this.selectedRanges = [].concat([], this.hourRange)
      }

      this.showRangePanel = true
    },

    confirmRange () {
      if (this.editingRange === 'minute') {
        this.minuteRange = [].concat([], this.selectedRanges || [])
      } else if (this.editingRange === 'second') {
        this.secondRange = [].concat([], this.selectedRanges || [])
      } else if (this.editingRange === 'hour') {
        this.hourRange = [].concat([], this.selectedRanges || [])
      }
      this.$nextTick(() => {
        this.closeRangePanel()
      })
    },

    closeRangePanel () {
      this.rangeTitle = ''
      this.editingRange = ''
      this.rangeList = undefined
      this.selectedRanges = []
      this.showRangePanel = false
    },

    selectAllRangeItems () {
      this.selectedRanges = [].concat([], this.rangeList || [])
    },

    unselectAllRangeItems () {
      this.selectedRanges = []
    },

    toggleBlurDelay () {
      this.blurDelay = 300
    },

    toggleManualInputTimeout () {
      this.manualInputTimeout = 1000
    }
  },

  mounted () {
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

      #valuesSelection.config-block
        h3.subtitle
          a.anchor #
          | Set&nbsp;
          code v-model
          | &nbsp;data
        config-row(label="Hour:")
          label.range-wrapper
            input(v-model="selected.hour" type="range", :min="hourBoundary.min", :max="hourBoundary.max" step="1")
            span(v-text="selected.hour")
        config-row(label="Minute:")
          label.range-wrapper
            input(v-model="selected.minute" type="range" min="0" max="59", :step="interval.minute")
            span(v-text="selected.minute")
        config-row(v-if="showSeconds" label="Second:")
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

      #intervalSelection.config-block
        h3.subtitle
          a.anchor #
          | Customized Intervals
        config-row(is-group)
          label.options
            input(v-model="customInterval.minute" type="checkbox")
            | &nbsp;Set Minute Interval
          label.range-wrapper(v-if="customInterval.minute")
            input(v-model.number="interval.minute" type="range" min="0" max="60" step="1")
            span(v-text="interval.minute")
        config-row(is-group v-if="showSeconds")
          label.options
            input(v-model="customInterval.second" type="checkbox")
            | &nbsp;Set Second Interval
          label.range-wrapper(v-if="customInterval.second")
            input(v-model.number="interval.second" type="range" min="0" max="60" step="1")
            span(v-text="interval.second")

      #customRanges.config-block
        h3.subtitle
          a.anchor #
          | Customized Ranges
        config-row(is-group)
          label.options
            input(v-model="customRange.hour" type="checkbox")
            | &nbsp;Set Hour Range
          .button-wrapper(v-if="customRange.hour" )
            button.common.size-small(@click="openRangePanel('hour')") Config
            span.item-count {{ hourRange.length }} value{{hourRange.length > 1 ? 's' : ''}} selected
        config-row(is-group)
          label.options
            input(v-model="customRange.minute" type="checkbox")
            | &nbsp;Set Minute Range
          .button-wrapper(v-if="customRange.minute" )
            button.common.size-small(@click="openRangePanel('minute')") Config
            span.item-count {{ minuteRange.length }} value{{minuteRange.length > 1 ? 's' : ''}} selected
        config-row(is-group v-if="showSeconds")
          label.options
            input(v-model="customRange.second" type="checkbox")
            | &nbsp;Set Second Range
          .button-wrapper(v-if="customRange.second" )
            button.common.size-small(@click="openRangePanel('second')") Config
            span.item-count {{ secondRange.length }} value{{secondRange.length > 1 ? 's' : ''}} selected

      #closeOnComplete.config-block
        h3.subtitle
          a.anchor #
          | Close on Complete
        config-row(is-group)
          label.options(for="close_on_complete_true")
            input(v-model="closeOnComplete" type="radio" id="close_on_complete_true" name="close_on_complete", :value="true")
            | &nbsp;Enable
          label.options(for="close_on_complete_false")
            input(v-model="closeOnComplete" type="radio" id="close_on_complete_false" name="close_on_complete", :value="false")
            | &nbsp;Disable

      #clearButton.config-block
        h3.subtitle
          a.anchor #
          | Clear Button
        config-row(is-group)
          label.options(for="hide_clear_btn_false")
            input(v-model="hideClearBtn" type="radio" id="hide_clear_btn_false" name="hide_clear_btn", :value="false")
            | &nbsp;Enable
          label.options(for="hide_clear_btn_true")
            input(v-model="hideClearBtn" type="radio" id="hide_clear_btn_true" name="hide_clear_btn", :value="true")
            | &nbsp;Disable

      #disablePicker.config-block
        h3.subtitle
          a.anchor #
          | Disable Picker
        config-row(is-group)
          label.options
            input(v-model="disablePicker" type="checkbox")
            | &nbsp;Disable

      #lazyMode.config-block
        h3.subtitle
          a.anchor #
          | Lazy Event Mode
        config-row(is-group)
          label.options(for="lazy_mode_true")
            input(v-model="lazyMode" type="radio" id="lazy_mode_true" name="lazy_mode", :value="true")
            | &nbsp;Enable
          label.options(for="lazy_mode_false")
            input(v-model="lazyMode" type="radio" id="lazy_mode_false" name="lazy_mode", :value="false")
            | &nbsp;Disable

      #autoScroll.config-block
        h3.subtitle
          a.anchor #
          | Auto Scroll
        config-row(is-group)
          label.options(for="auto_scroll_true")
            input(v-model="autoScroll" type="radio" id="auto_scroll_true" name="auto_scroll", :value="true")
            | &nbsp;Enable
          label.options(for="auto_scroll_false")
            input(v-model="autoScroll" type="radio" id="auto_scroll_false" name="auto_scroll", :value="false")
            | &nbsp;Disable

      #manualInput.config-block
        h3.subtitle
          a.anchor #
          | Manually Input Support
        config-row(is-group)
          label.options(for="manual_input_true")
            input(v-model="manualInput" type="radio" id="manual_input_true" name="manual_input", :value="true")
            | &nbsp;Enable
          label.options(for="manual_input_false")
            input(v-model="manualInput" type="radio" id="manual_input_false" name="manual_input", :value="false")
            | &nbsp;Disable

      #hideDropdown.config-block(v-if="manualInput")
        h3.subtitle
          a.anchor #
          | Hide Dropdown
        config-row(is-group)
          label.options(for="hide_dropdown_true")
            input(v-model="hideDropdown" type="radio" id="hide_dropdown_true" name="hide_dropdown", :value="true")
            | &nbsp;Enable
          label.options(for="hide_dropdown_false")
            input(v-model="hideDropdown" type="radio" id="hide_dropdown_false" name="hide_dropdown", :value="false")
            | &nbsp;Disable

      #manualInputTimeout.config-block(v-if="manualInput")
        h3.subtitle
          a.anchor #
          | Customized Manual Input Timeout
        config-row(is-group)
          label.options
            input(v-model="customManualInputTimeout" type="checkbox" @input="toggleManualInputTimeout")
            | &nbsp;Set Manual Input Timeout
          label.range-wrapper(v-if="customManualInputTimeout")
            input(v-model.number="manualInputTimeout" type="range" min="50" max="5000" step="50")
            span(v-text="manualInputTimeout")

      #advancedKeyboard.config-block
        h3.subtitle
          a.anchor #
          | Advanced Keyboard Support
        config-row(is-group)
          label.options(for="advanced_kb_true")
            input(v-model="advancedKeyboard" type="radio" id="advanced_kb_true" name="advanced_kb", :value="true")
            | &nbsp;Enable
          label.options(for="advanced_kb_false")
            input(v-model="advancedKeyboard" type="radio" id="advanced_kb_false" name="advanced_kb", :value="false")
            | &nbsp;Disable

      #blurDelay.config-block
        h3.subtitle
          a.anchor #
          | Customized Blur Delay
        config-row(is-group)
          label.options
            input(v-model="customBlurDelay" type="checkbox" @input="toggleBlurDelay")
            | &nbsp;Set Blur Delay
          label.range-wrapper(v-if="customBlurDelay")
            input(v-model.number="blurDelay" type="range" min="50" max="1500" step="50")
            span(v-text="blurDelay")

      #fixedDropdownBtn.config-block
        h3.subtitle
          a.anchor #
          | Fixed Dropdown Button
        config-row(is-group)
          label.options(for="fixed_dd_btn_true")
            input(v-model="fixedDropdownBtn" type="radio" id="fixed_dd_btn_true" name="fixed_dd_btn", :value="true")
            | &nbsp;Enable
          label.options(for="fixed_dd_btn_false")
            input(v-model="fixedDropdownBtn" type="radio" id="fixed_dd_btn_false" name="fixed_dd_btn", :value="false")
            | &nbsp;Disable

      #skipErrorStyle.config-block
        h3.subtitle
          a.anchor #
          | Skip Error Style
        config-row(is-group)
          label.options(for="skip_error_true")
            input(v-model="skipErrorStyle" type="radio" id="skip_error_true" name="skip_error", :value="true")
            | &nbsp;Enable
          label.options(for="skip_error_false")
            input(v-model="skipErrorStyle" type="radio" id="skip_error_false" name="skip_error", :value="false")
            | &nbsp;Disable

      #appendToBody.config-block
        h3.subtitle
          a.anchor #
          | Append To Body
        config-row(is-group)
          label.options(for="append_to_body_true")
            input(v-model="appendToBody" type="radio" id="append_to_body_true" name="append_to_body", :value="true")
            | &nbsp;Enable
          label.options(for="append_to_body_false")
            input(v-model="appendToBody" type="radio" id="append_to_body_false" name="append_to_body", :value="false")
            | &nbsp;Disable

      #debugMode.config-block
        h3.subtitle
          a.anchor #
          | Debug Mode
        config-row(is-group)
          label.options(for="debug_mode_true")
            input(v-model="debugMode" type="radio" id="debug_mode_true" name="debug_mode", :value="true")
            | &nbsp;Enable
          label.options(for="debug_mode_false")
            input(v-model="debugMode" type="radio" id="debug_mode_false" name="debug_mode", :value="false")
            | &nbsp;Disable

  //-
  //- Live preview on the left panel
  //-
  aside.previews(:style="asideStyle")
    #playgroundPreview.preview
      label(for="vueTimepickerInPlayground")
        b Format string:&nbsp;
        span(v-text="formatString")
      p
        vue-timepicker(v-model="playgroundData"
                       id="vueTimepickerInPlayground"
                       :format="formatString"
                       :minute-interval="interval.minute"
                       :second-interval="showSeconds ? interval.second : null"
                       :hour-range="customRange.hour ? hourRange : null"
                       :minute-range="customRange.minute ? minuteRange : null"
                       :second-range="(showSeconds && customRange.second) ? secondRange : null"
                       :close-on-complete="closeOnComplete"
                       :advanced-keyboard="advancedKeyboard"
                       :manual-input="manualInput"
                       :hide-dropdown="toHideDropdown"
                       :blur-delay="blurDelay"
                       :manual-input-timeout="manualInputTimeout"
                       :hide-clear-button="hideClearBtn"
                       :fixed-dropdown-button="fixedDropdownBtn"
                       :disabled="disablePicker"
                       :lazy="lazyMode"
                       :auto-scroll="autoScroll"
                       :append-to-body="appendToBody"
                       :debug-mode="debugMode"
                       :input-class="skipErrorStyle ? 'skip-error-style' : null"
                       @change="changeHandler"
                       @error="errorHandler")

    #htmlCodePreview.codes
      highlight-code(lang="html" data-title="HTML") {{ htmlCodeWithVar }}

    #dispatchedValue.codes
      highlight-code(lang="json" data-title="@change event data") {{ playgroundFullValue }}
      highlight-code(v-if="showErroredData" lang="json" data-title="@error event data") {{ playgroundErroredData }}

  //-
  //- Customized Range Panels
  //-
  overlay-panel(v-if="showRangePanel" :title="rangeTitle" @close="closeRangePanel")
    template(v-slot:footerLeft)
      button.secondary(@click="selectAllRangeItems") Select All
      button.secondary(@click="unselectAllRangeItems") Unselect All
    template(v-slot:footerRight)
      button(@click="confirmRange") Confirm

    .valid-items
      label.range-item(v-for="(rangeItem, rIndex) in rangeList")
        input(type="checkbox" name="selected_ranges" v-model="selectedRanges" :value="rangeItem")
        | {{ rangeItem }}

    .invalid-items(v-if="filteredOutValues && filteredOutValues.length")
      b Values selected but filtered out by the&nbsp;
        template(v-if="editingRange !== 'hour'") {{editingRange}}-interval:
        template(v-else) current hour type
      .items-list
        span.invalid-range(v-for="oItem in filteredOutValues" :key="oItem" v-text="oItem")

</template>

<style lang="stylus">
@import '../assets/_variables.styl'

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

    .button-wrapper
      display: flex
      flex-flow: row wrap
      justify-content: flex-start
      align-items: center
      padding: 0.3em 0.5em
      border-radius: 4px
      background: -black(0.05)

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
    padding: 1em 1.5em

  .range-item,
  .invalid-range
    display: inline-block
    margin-right: 1em
    margin-bottom: 0.5em
  
  .range-item
    min-width: 3em

  .invalid-range
    opacity: 0.7

  .invalid-items
    margin-top: 1em
    padding: 0.8em 0.8em 0.3em 0.8em
    background: -black(0.05)
    border-radius: 6px

    .items-list
      padding-top: 0.8em

  .item-count
    font-size: 0.85em
    padding-left: 0.5em
    opacity: 0.7
</style>
