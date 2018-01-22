<script>
const CONFIG = {
  HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
  MINUTE_TOKENS: ['mm', 'm'],
  SECOND_TOKENS: ['ss', 's'],
  APM_TOKENS: ['A', 'a']
}

export default {
  name: 'VueTimepicker',

  props: {
    value: {
      required: true,
      type: Object
    },

    hideClearButton: {
      type: Boolean
    },

    format: {
      type: String,
      default: 'HH:mm'
    },

    minuteInterval: {
      type: Number,
      default: 1,
      validator: val => {
        if (val < 0) {
          throw new Error('minute-interval must be greater than 0')
        }
        return true;
      }
    },

    secondInterval: {
      type: Number,
      default: 1,
      validator: val => {
        if (val < 0) {
          throw new Error('second-interval must be greater than 0')
        }
        return true;
      }
    },

    disabled: { type: Boolean },

    disabledValues: {
      type: Object,
      default: () => { return { hour: [], minute: [], second: [], apm: [] } }
    }
  },

  data () {
    return {
      showDropdown: false,
    }
  },

  computed: {
    displayTime () {
      let formatString = this.format

      if (this.value[this.hourType]) {
        formatString = formatString.replace(new RegExp(this.hourType, 'g'), this.value[this.hourType])
      }
      if (this.value[this.minuteType]) {
        formatString = formatString.replace(new RegExp(this.minuteType, 'g'), this.value[this.minuteType])
      }
      if (this.value[this.secondType] && this.secondType) {
        formatString = formatString.replace(new RegExp(this.secondType, 'g'), this.value[this.secondType])
      }
      if (this.value[this.apmType] && this.apmType) {
        formatString = formatString.replace(new RegExp(this.apmType, 'g'), this.value[this.apmType])
      }

      return formatString
    },

    showClearBtn () {
      return !!this.value[this.hourType] || !!this.value[this.minuteType]
    },

    hourType () {
      return this.checkAcceptingType(CONFIG.HOUR_TOKENS, this.format, 'HH')
    },

    minuteType () {
      return this.checkAcceptingType(CONFIG.MINUTE_TOKENS, this.format, 'mm')
    },

    secondType () {
      return this.checkAcceptingType(CONFIG.SECOND_TOKENS, this.format)
    },

    apmType () {
      return this.checkAcceptingType(CONFIG.APM_TOKENS, this.format)
    },

    hours () {
      const hoursCount = this.isTwelveHours ? 12 : 24

      let hours = []

      for (let i = 0; i < hoursCount; i++) {
        switch(this.hourType) {
          case 'H':
            hours.push( String(i) )
            break;
          case 'HH':
            hours.push( ('0' + i).substr(-2, 2) )
            break;
          case 'h':
          case 'k':
            hours.push( String(i + 1) )
            break;
          case 'hh':
          case 'kk':
            hours.push( ('0' + String(i + 1)).substr(-2, 2) )
            break;
        }
      }

      return hours;
    },

    minutes () {
      let minutes = []

      for (let i = 0; i < 60; i += this.minuteInterval) {
        switch(this.minuteType) {
          case 'm':
            minutes.push(String(i))
            break;
          case 'mm':
            minutes.push( ('0' + i).substr(-2, 2) )
            break;
        }
      }

      return minutes
    },

    seconds () {
      let seconds = []

      for (let i = 0; i < 60; i += this.secondInterval) {
        switch(this.secondType) {
          case 's':
            seconds.push(i)
            break;
          case 'ss':
            seconds.push( ('0' + i).substr(-2, 2) )
            break;
        }
      }

      return seconds
    },

    apms () {
      switch (this.apmType) {
        case 'A':
          return ['AM', 'PM']
        case 'a':
          return ['am', 'pm']
        default:
          return []
      }
    },

    isTwelveHours () {
      return this.hourType === 'h' || this.hourType === 'hh'
    },

    isPastNoon () {
      return this.apm === 'pm' || this.apm === 'PM'
    },
  },

  methods: {
    checkAcceptingType (validValues, formatString, fallbackValue) {
      if (!validValues || !formatString || !formatString.length) { return '' }

      const length = validValues.length

      for (let i = 0; i < length; i++) {
        if (formatString.indexOf(validValues[i]) > -1) {
          return validValues[i]
        }
      }

      return fallbackValue || ''
    },

    toggleDropdown () {
      this.showDropdown = !this.showDropdown && !this.disabled
      if (!this.showDropdown) {
        this.$emit('blur', {
          ...this.value
        })
      }
    },

    onHourSelect (value) {
      this.$emit('input', {
        ...this.value,
        [this.hourType]: value
      })
    },

    onMinuteSelect (value) {
      this.$emit('input', {
        ...this.value,
        [this.minuteType]: value
      })
    },

    onSecondSelect (value) {
      this.$emit('input', {
        ...this.value,
        [this.secondType]: value
      })
    },

    onApmSelect (value) {
      this.$emit('input', {
        ...this.value,
        [this.apmType]: value
      })
    },

    clearTime () {
      let time = {}

      time[this.hourType] = ''
      time[this.minuteType] = ''
      time[this.secondType] = ''

      this.apm = this.apms[0]
      this.$emit('input', time)
    }
  }
}
</script>

<template>
<span class="time-picker">
  <input class="display-time" :readonly="!disabled" :disabled="disabled" :value="displayTime" @click.stop="toggleDropdown" type="text" />
  <span class="clear-btn" v-if="!hideClearButton" v-show="!showDropdown && showClearBtn" @click.stop="clearTime">&times;</span>
  <div class="time-picker-overlay" v-if="showDropdown" @click.stop="toggleDropdown"></div>
  <div class="dropdown" v-show="showDropdown">
    <div class="select-list">
      <ul class="hours">
        <li class="hint" v-text="hourType"></li>
        <li
          v-for="hr in hours"
          v-text="hr"
          v-show="disabledValues.hour.indexOf(hr) === -1"
          :class="{active: value[hourType] === hr}"
          @click.stop="onHourSelect(hr)"></li>
      </ul>
      <ul class="minutes">
        <li class="hint" v-text="minuteType"></li>
        <li
          v-for="m in minutes"
          v-text="m"
          v-show="disabledValues.minute.indexOf(m) === -1"
          :class="{active: value[minuteType] === m}"
          @click.stop="onMinuteSelect(m)"></li>
      </ul>
      <ul class="seconds" v-if="secondType">
        <li class="hint" v-text="secondType"></li>
        <li
          v-for="s in seconds"
          v-text="s"
          v-show="disabledValues.second.indexOf(s) === -1"
          :class="{active: value[secondType] === s}"
          @click.stop="onSecondSelect(s)"></li>
      </ul>
      <ul class="apms" v-if="apmType">
        <li class="hint" v-text="apmType"></li>
        <li
          v-for="a in apms"
          v-text="a"
          v-show="disabledValues.apm.indexOf(a) === -1"
          :class="{active: value[apmType] === a}"
          @click.stop="onApmSelect(a)"></li>
      </ul>
    </div>
  </div>
</span>
</template>

<style>
@import './style/vue-timepicker.css';
</style>
