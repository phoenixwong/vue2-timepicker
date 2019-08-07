<script>
const CONFIG = {
  HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
  MINUTE_TOKENS: ['mm', 'm'],
  SECOND_TOKENS: ['ss', 's'],
  APM_TOKENS: ['A', 'a']
}

const DEFAULT_OPTIONS = {
  format: 'HH:mm',
  hideClearButton: false,
  minuteInterval: 1,
  secondInterval: 1,
  hourRange: null,
  hideDisabledHours: false
}

export default {
  name: 'VueTimepicker',
  props: {
    value: { type: Object, default: () => {} },
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    format: { type: String },
    hideClearButton: { type: Boolean, default: false },
    minuteInterval: { type: [ Number, String ] },
    secondInterval: { type: [ Number, String ] },
    hourRange: { type: Array },
    hideDisabledHours: { type: Boolean, default: false }
  },

  data () {
    return {
      timeValue: {},

      hours: [],
      minutes: [],
      seconds: [],
      apms: [],
      showDropdown: false,

      hourType: 'HH',
      minuteType: 'mm',
      secondType: '',
      apmType: '',
      hour: '',
      minute: '',
      second: '',
      apm: '',
      fullValues: undefined
    }
  },

  computed: {
    opts () {
      const options = Object.assign({}, DEFAULT_OPTIONS)

      if (this.format && this.format.length) {
        options.format = String(this.format)
      }

      if (this.hideClearButton) {
        options.hideClearButton = true
      }

      if (this.isNumber(this.minuteInterval)) {
        options.minuteInterval = +this.minuteInterval
      }
      // minuteInterval failsafe
      if (!options.minuteInterval || options.minuteInterval < 1 || options.minuteInterval > 60) {
        if (options.minuteInterval === 0) {
          options.minuteInterval = 60
        } else {
          if (options.minuteInterval > 60) {
            window.console.warn(`'minute-interval' should be less than 60. Current value is ${this.minuteInterval}`)
          } else if (options.minuteInterval < 1) {
            window.console.warn(`'minute-interval' should be NO less than 1. Current value is ${this.minuteInterval}`)
          }
          options.minuteInterval = 1
        }
      }

      if (this.isNumber(this.secondInterval)) {
        options.secondInterval = +this.secondInterval
      }
      // secondInterval failsafe
      if (!options.secondInterval || options.secondInterval < 1 || options.secondInterval > 60) {
        if (options.secondInterval === 0) {
          options.secondInterval = 60
        } else {
          if (options.secondInterval > 60) {
            window.console.warn(`'second-interval' should be less than 60. Current value is ${this.secondInterval}`)
          } else if (options.secondInterval < 1) {
            window.console.warn(`'second-interval' should be NO less than 1. Current value is ${this.secondInterval}`)
          }
          options.secondInterval = 1
        }
      }

      if (this.hourRange && Array.isArray(this.hourRange)) {
        options.hourRange = JSON.parse(JSON.stringify(this.hourRange))
      }

      if (this.hideDisabledHours) {
        options.hideDisabledHours = true
      }

      return options
    },

    displayTime () {
      let formatString = String((this.opts.format || DEFAULT_OPTIONS.format))
      if (this.hour) {
        formatString = formatString.replace(new RegExp(this.hourType, 'g'), this.hour)
      }
      if (this.minute) {
        formatString = formatString.replace(new RegExp(this.minuteType, 'g'), this.minute)
      }
      if (this.second && this.secondType) {
        formatString = formatString.replace(new RegExp(this.secondType, 'g'), this.second)
      }
      if (this.apm && this.apmType) {
        formatString = formatString.replace(new RegExp(this.apmType, 'g'), this.apm)
      }
      return formatString
    },

    showClearBtn () {
      if (this.hideClearButton || this.disabled) {
        return false
      }
      if ((this.hour && this.hour !== '') || (this.minute && this.minute !== '')) {
        return true
      }
      return false
    },

    baseOn12Hours () {
      return this.hourType === 'h' || this.hourType === 'hh'
    },

    hourRangeIn24HrFormat () {
      if (this.opts.hourRange && this.opts.hourRange.length) {
        let range = []
        this.opts.hourRange.forEach((value) => {
          if (value instanceof Array) {
            if (value.length > 2) {
              window.console.warn('Nested array within `hour-range` must contain no more than two items. Only the first two items of', value, 'will be taking into account.')
            }

            let start = value[0]
            let end = value[1] || value[0]

            if (this.is12hRange(start)) {
              start = this.translate12hRange(start)
            }
            if (this.is12hRange(end)) {
              end = this.translate12hRange(end)
            }

            for (let i = +start; i <= +end; i++) {
              if (range.indexOf(i) === -1) {
                range.push(i)
              }
            }
          } else {
            if (this.is12hRange(value)) {
              value = this.translate12hRange(value)
            }
            if (range.indexOf(value) === -1) {
              range.push(value)
            }
          }
        })
        range.sort((l, r) => { return l - r })
        return range
      }
      if (this.opts.hourRange && !this.opts.hourRange.length) {
        window.console.log('NOTICE: The `hour-range` array is empty (length === 0)')
        return []
      }
      return false
    },

    restrictedHourRange () {
      if (!this.hourRangeIn24HrFormat) {
        return false
      }
      if (this.baseOn12Hours) {
        const range = this.hourRangeIn24HrFormat.map((value) => {
          if (value === 12) {
            return '12p'
          } else if (value === 24) {
            return '12a'
          }
          return value > 12 ? value % 12 + 'p' : value + 'a'
        })
        return range
      }
      return this.hourRangeIn24HrFormat
    },

    has () {
      const result = {
        am: true,
        pm: true
      }

      if (this.hourRangeIn24HrFormat && this.hourRangeIn24HrFormat.length) {
        const range = [].concat([], this.hourRangeIn24HrFormat)
        result.am = range.some(this.hasAm)
        result.pm = range.some(this.hasPm)
      }

      return result
    }
  },

  watch: {
    'opts.format' (newValue) {
      this.renderFormat(newValue)
    },
    'opts.minuteInterval' (newInteval) {
      this.renderList('minute', newInteval)
    },
    'opts.secondInterval' (newInteval) {
      this.renderList('second', newInteval)
    },
    value () {
      this.readValues()
    },
    displayTime () {
      this.fillValues()
    },
    disabled (toDisabled) {
      // Force close dropdown when disabled
      if (toDisabled && this.showDropdown) {
        this.showDropdown = false
      }
    }
  },

  methods: {
    formatValue (type, i) {
      switch (type) {
        case 'H':
        case 'm':
        case 's':
          return String(i)
        case 'HH':
        case 'mm':
        case 'ss':
          return i < 10 ? `0${i}` : String(i)
        case 'h':
          if (i === 0) {
            return '12'
          }
          return String(i)
        case 'k':
          return String(i + 1)
        case 'hh':
          if (i === 0) {
            return '12'
          }
          return i < 10 ? `0${i}` : String(i)
        case 'kk':
          return (i + 1) < 10 ? `0${i + 1}` : String(i + 1)
        default:
          return ''
      }
    },

    checkAcceptingType (validValues, formatString, fallbackValue) {
      if (!validValues || !formatString || !formatString.length) { return '' }
      for (let i = 0; i < validValues.length; i++) {
        if (formatString.indexOf(validValues[i]) > -1) {
          return validValues[i]
        }
      }
      return fallbackValue || ''
    },

    renderFormat (newFormat) {
      newFormat = newFormat || this.opts.format || DEFAULT_OPTIONS.format

      this.hourType = this.checkAcceptingType(CONFIG.HOUR_TOKENS, newFormat, 'HH')
      this.minuteType = this.checkAcceptingType(CONFIG.MINUTE_TOKENS, newFormat, 'mm')
      this.secondType = this.checkAcceptingType(CONFIG.SECOND_TOKENS, newFormat)
      this.apmType = this.checkAcceptingType(CONFIG.APM_TOKENS, newFormat)

      this.renderHoursList()
      this.renderList('minute')

      if (this.secondType) {
        this.renderList('second')
      }

      if (this.apmType) {
        this.renderApmList()
      }

      this.$nextTick(() => {
        this.readValues()
      })
    },

    renderHoursList () {
      const hoursCount = (this.baseOn12Hours) ? 12 : 24
      const hours = []
      for (let i = 0; i < hoursCount; i++) {
        hours.push(this.formatValue(this.hourType, i))
      }
      this.hours = hours
    },

    renderList (listType, interval) {
      if (listType === 'second') {
        interval = interval || this.opts.secondInterval || DEFAULT_OPTIONS.secondInterval
      } else if (listType === 'minute') {
        interval = interval || this.opts.minuteInterval || DEFAULT_OPTIONS.minuteInterval
      } else {
        return
      }

      const result = []
      for (let i = 0; i < 60; i += interval) {
        if (listType === 'minute') {
          result.push(this.formatValue(this.minuteType, i))
        } else {
          result.push(this.formatValue(this.secondType, i))
        }
      }

      if (listType === 'minute') {
        this.minutes = result
      } else {
        this.seconds = result
      }
    },

    renderApmList () {
      let apms = []
      if (this.apmType) {
        apms = this.apmType === 'A' ? ['AM', 'PM'] : ['am', 'pm']
      }
      this.apms = apms
    },

    readValues () {
      const timeValue = JSON.parse(JSON.stringify(this.value || {}))
      const values = Object.keys(timeValue)

      // Failsafe for empty `v-model`
      if (values.length === 0) {
        timeValue[this.hourType] = ''
        timeValue[this.minuteType] = ''
        if (this.secondType) {
          timeValue[this.secondType] = ''
        }
        if (this.apmType) {
          timeValue[this.apmType] = ''
        }
      // `v-model` with defined value
      } else {
        if (values.indexOf(this.hourType) > -1) {
          this.hour = timeValue[this.hourType]
        }
        if (values.indexOf(this.minuteType) > -1) {
          this.minute = timeValue[this.minuteType]
        }
        if (values.indexOf(this.secondType) > -1) {
          this.second = timeValue[this.secondType]
        } else {
          this.second = 0
        }
        if (values.indexOf(this.apmType) > -1) {
          this.apm = timeValue[this.apmType]
        }
      }
      this.timeValue = timeValue
    },

    fillValues () {
      const fullValues = {}

      const baseHour = this.hour
      const baseHourType = this.hourType

      const hourValue = baseHour || baseHour === 0 ? Number(baseHour) : ''
      const apmValue = (this.baseOn12Hours && this.apm) ? String(this.apm).toLowerCase() : false

      CONFIG.HOUR_TOKENS.forEach((token) => {
        if (token === baseHourType) {
          fullValues[token] = baseHour
          return
        }

        let value
        let apm
        switch (token) {
          case 'H':
          case 'HH':
            if (!String(hourValue).length) {
              fullValues[token] = ''
              return
            } else if (this.baseOn12Hours) {
              if (apmValue === 'pm') {
                value = hourValue < 12 ? hourValue + 12 : hourValue
              } else {
                value = hourValue % 12
              }
            } else {
              value = hourValue % 24
            }
            fullValues[token] = (token === 'HH' && value < 10) ? `0${value}` : String(value)
            break
          case 'k':
          case 'kk':
            if (!String(hourValue).length) {
              fullValues[token] = ''
              return
            } else if (this.baseOn12Hours) {
              if (apmValue === 'pm') {
                value = hourValue < 12 ? hourValue + 12 : hourValue
              } else {
                value = hourValue === 12 ? 24 : hourValue
              }
            } else {
              value = hourValue === 0 ? 24 : hourValue
            }
            fullValues[token] = (token === 'kk' && value < 10) ? `0${value}` : String(value)
            break
          case 'h':
          case 'hh':
            if (apmValue) {
              value = hourValue
              apm = apmValue || 'am'
            } else {
              if (!String(hourValue).length) {
                fullValues[token] = ''
                fullValues.a = ''
                fullValues.A = ''
                return
              } else if (hourValue > 11) {
                apm = 'pm'
                value = hourValue === 12 ? 12 : hourValue % 12
              } else {
                if (this.baseOn12Hours) {
                  apm = ''
                } else {
                  apm = 'am'
                }
                value = hourValue % 12 === 0 ? 12 : hourValue
              }
            }
            fullValues[token] = (token === 'hh' && value < 10) ? `0${value}` : String(value)
            fullValues.a = apm
            fullValues.A = apm.toUpperCase()
            break
        }
      })

      if (this.minute || this.minute === 0) {
        const minuteValue = Number(this.minute)
        fullValues.m = String(minuteValue)
        fullValues.mm = minuteValue < 10 ? `0${minuteValue}` : String(minuteValue)
      } else {
        fullValues.m = ''
        fullValues.mm = ''
      }

      if (this.second || this.second === 0) {
        const secondValue = Number(this.second)
        fullValues.s = String(secondValue)
        fullValues.ss = secondValue < 10 ? `0${secondValue}` : String(secondValue)
      } else {
        fullValues.s = ''
        fullValues.ss = ''
      }

      this.fullValues = fullValues
      this.updateTimeValue(fullValues)
    },

    updateTimeValue (fullVals) {
      if (!fullVals) { return }

      const fullValues = Object.assign({}, fullVals)

      const baseTimeValue = JSON.parse(JSON.stringify(this.timeValue || {}))
      const timeValue = {}

      Object.keys(baseTimeValue).forEach((key) => {
        timeValue[key] = fullValues[key] || ''
      })

      this.$emit('input', JSON.parse(JSON.stringify(timeValue)))
      this.$emit('change', {data: fullVals})
    },

    is12hRange (value) {
      return /^\d{1,2}(a|p|A|P)$/.test(value)
    },

    translate12hRange (value) {
      const valueT = value.match(/^(\d{1,2})(a|p|A|P)$/)
      if (+valueT[1] === 12) {
        return +valueT[1] + (valueT[2].toLowerCase() === 'p' ? 0 : 12)
      }
      return +valueT[1] + (valueT[2].toLowerCase() === 'p' ? 12 : 0)
    },

    hasAm (value) {
      return value < 12 || value === 24
    },

    hasPm (value) {
      return value >= 12 && value < 24
    },

    isDisabledHour (value) {
      if (this.restrictedHourRange) {
        if (this.baseOn12Hours) {
          if (!this.apm || !this.apm.length) {
            return false
          } else {
            const token = this.apm.toLowerCase() === 'am' ? 'a' : 'p'
            return this.restrictedHourRange.indexOf(`${+value}${token}`) === -1
          }
        } else {
          return this.restrictedHourRange.indexOf(+value) === -1
        }
      }
      return false
    },

    forceApmSelection () {
      if (!this.apm || !this.apm.length) {
        if (this.has.am) {
          this.apm = this.apmType === 'A' ? 'AM' : 'am'
        } else if (this.has.pm) {
          this.apm = this.apmType === 'A' ? 'PM' : 'pm'
        }
      }
    },

    emptyApmSelection () {
      if (this.hour === '' && this.minute === '' && this.second === '') {
        this.apm = ''
      }
    },

    isNumber (value) {
      return !isNaN(parseFloat(value)) && isFinite(value)
    },

    toggleDropdown () {
      if (this.disabled) { return }
      this.showDropdown = !this.showDropdown
      if (this.restrictedHourRange && this.baseOn12Hours) {
        if (this.showDropdown) {
          this.forceApmSelection()
          this.$emit('open')
        } else {
          this.emptyApmSelection()
          this.$emit('close')
        }
      }
    },

    select (type, value) {
      if (type === 'hour') {
        if (this.isDisabledHour(value)) { return }
        this.hour = value
      } else if (type === 'minute') {
        this.minute = value
      } else if (type === 'second') {
        this.second = value
      } else if (type === 'apm') {
        if (!this.has[value.toLowerCase()]) { return }
        this.apm = value
      }
    },

    clearTime () {
      if (this.disabled) { return }
      this.hour = ''
      this.minute = ''
      this.second = ''
      this.apm = ''
    }
  },

  mounted () {
    this.renderFormat()
  }
}
</script>

<template>
<span class="vue__time-picker">
  <input type="text" class="display-time"
         :id="id"
         :name="name"
         :value="displayTime"
         :disabled="disabled"
         readonly
         @click.stop="toggleDropdown" />
  <span class="clear-btn" v-if="!showDropdown && showClearBtn" @click.stop="clearTime">&times;</span>
  <div class="time-picker-overlay" v-if="showDropdown" @click.stop="toggleDropdown"></div>
  <div class="dropdown" v-show="showDropdown">
    <div class="select-list">
      <ul class="hours">
        <li class="hint" v-text="hourType"></li>
        <template v-for="(hr, hIndex) in hours">
          <li v-if="!opts.hideDisabledHours || (opts.hideDisabledHours && !isDisabledHour(hr))"
              :key="hIndex"
              :class="{active: hour === hr}"
              v-text="hr"
              :disabled="isDisabledHour(hr)"
              @click.stop="select('hour', hr)"></li>
        </template>
      </ul>
      <ul class="minutes">
        <li class="hint" v-text="minuteType"></li>
        <li v-for="(m, mIndex) in minutes"
            :key="mIndex"
            :class="{active: minute === m}"
            v-text="m"
            @click.stop="select('minute', m)"></li>
      </ul>
      <ul class="seconds" v-if="secondType">
        <li class="hint" v-text="secondType"></li>
        <li v-for="(s, sIndex) in seconds"
            :key="sIndex"
            :class="{active: second === s}"
            v-text="s"
            @click.stop="select('second', s)"></li>
      </ul>
      <ul class="apms" v-if="apmType">
        <li class="hint" v-text="apmType"></li>
        <template v-for="(a, aIndex) in apms">
          <li v-if="!opts.hideDisabledHours || (opts.hideDisabledHours && has[a.toLowerCase()])"
              :key="aIndex"
              :class="{active: apm === a}"
              v-text="a"
              :disabled="!has[a.toLowerCase()]"
              @click.stop="select('apm', a)"></li>
        </template>
      </ul>
    </div>
  </div>
</span>
</template>

<style>
.vue__time-picker {
  display: inline-block;
  position: relative;
  font-size: 1em;
  width: 10em;
  font-family: sans-serif;
  vertical-align: middle;
}

.vue__time-picker * {
  box-sizing: border-box;
}

.vue__time-picker input.display-time {
  border: 1px solid #d2d2d2;
  width: 10em;
  height: 2.2em;
  padding: 0.3em 0.5em;
  font-size: 1em;
}

.vue__time-picker input.display-time:disabled,
.vue__time-picker input.display-time[disabled] {
  color: #d2d2d2;
}

.vue__time-picker .clear-btn {
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  margin-top: -0.15em;
  z-index: 3;
  font-size: 1.1em;
  line-height: 1em;
  vertical-align: middle;
  width: 1.3em;
  color: #d2d2d2;
  background: rgba(255,255,255,0);
  text-align: center;
  font-style: normal;

  -webkit-transition: color .2s;
  transition: color .2s;
}

.vue__time-picker .clear-btn:hover {
  color: #797979;
  cursor: pointer;
}

.vue__time-picker .time-picker-overlay {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.vue__time-picker .dropdown {
  position: absolute;
  z-index: 5;
  top: calc(2.2em + 2px);
  left: 0;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.15);
  width: 10em;
  height: 10em;
  font-weight: normal;
}

.vue__time-picker .dropdown .select-list {
  width: 10em;
  height: 10em;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: space-between;
}

.vue__time-picker .dropdown ul {
  padding: 0;
  margin: 0;
  list-style: none;

  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.vue__time-picker .dropdown ul.minutes,
.vue__time-picker .dropdown ul.seconds,
.vue__time-picker .dropdown ul.apms{
  border-left: 1px solid #fff;
}

.vue__time-picker .dropdown ul li {
  text-align: center;
  padding: 0.3em 0;
  color: #161616;
}

.vue__time-picker .dropdown ul li:not(.hint):not([disabled]):hover {
  background: rgba(0,0,0,.08);
  color: #161616;
  cursor: pointer;
}

.vue__time-picker .dropdown ul li:not([disabled]).active,
.vue__time-picker .dropdown ul li:not([disabled]).active:hover {
  background: #41B883;
  color: #fff;
}

.vue__time-picker .dropdown ul li[disabled],
.vue__time-picker .dropdown ul li[disabled]:hover {
  background: transparent;
  opacity: 0.3;
  cursor: not-allowed;
}

.vue__time-picker .dropdown .hint {
  color: #a5a5a5;
  cursor: default;
  font-size: 0.8em;
}
</style>
