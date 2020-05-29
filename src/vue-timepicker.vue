<script>
const CONFIG = {
  HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
  MINUTE_TOKENS: ['mm', 'm'],
  SECOND_TOKENS: ['ss', 's'],
  APM_TOKENS: ['A', 'a'],
  BASIC_TYPES: ['hour', 'minute', 'second', 'apm']
}

const DEFAULT_OPTIONS = {
  format: 'HH:mm',
  minuteInterval: 1,
  secondInterval: 1,
  hourRange: null,
  minuteRange: null,
  secondRange: null,
  hideDisabledHours: false,
  hideDisabledMinutes: false,
  hideDisabledSeconds: false,
  hideDisabledItems: false,
  advancedKeyboard: false,
  hideDropdown: false,
  blurDelay: 300,
  manualInputTimeout: 1000
}

export default {
  name: 'VueTimepicker',
  props: {
    value: { type: [ Object, String ] },
    format: { type: String },
    minuteInterval: { type: [ Number, String ] },
    secondInterval: { type: [ Number, String ] },

    hourRange: { type: Array },
    minuteRange: { type: Array },
    secondRange: { type: Array },

    hideDisabledHours: { type: Boolean, default: false },
    hideDisabledMinutes: { type: Boolean, default: false },
    hideDisabledSeconds: { type: Boolean, default: false },
    hideDisabledItems: { type: Boolean, default: false },

    hideClearButton: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    closeOnComplete: { type: Boolean, default: false },

    id: { type: String },
    name: { type: String },
    inputClass: { type: [ String, Object, Array ] },
    placeholder: { type: String },
    tabindex: { type: [ Number, String ], default: 0 },
    inputWidth: { type: String },
    autocomplete: { type: String, default: 'off' },

    hourLabel: { type: String },
    minuteLabel: { type: String },
    secondLabel: { type: String },
    apmLabel: { type: String },
    amText: { type: String },
    pmText: { type: String },

    blurDelay: { type: [ Number, String ] },
    advancedKeyboard: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },

    autoScroll: { type: Boolean, default: false },
    manualInput: { type: Boolean, default: false },
    manualInputTimeout: { type: [ Number, String ] },
    hideDropdown: { type: Boolean, default: false },

    debugMode: { type: Boolean, default: false }
  },

  data () {
    return {
      timeValue: {},

      hours: [],
      minutes: [],
      seconds: [],
      apms: [],

      showDropdown: false,
      isFocusing: false,
      debounceTimer: undefined,

      hourType: 'HH',
      minuteType: 'mm',
      secondType: '',
      apmType: '',
      hour: '',
      minute: '',
      second: '',
      apm: '',
      fullValues: undefined,
      bakDisplayTime: undefined,

      selectionTimer: undefined,
      kbInputTimer: undefined,
      kbInputLog: '',
      bakCurrentPos: null
    }
  },

  computed: {
    opts () {
      const options = Object.assign({}, DEFAULT_OPTIONS)

      if (this.format && this.format.length) {
        options.format = String(this.format)
      }

      if (this.isNumber(this.minuteInterval)) {
        options.minuteInterval = +this.minuteInterval
      }
      // minuteInterval failsafe
      if (!options.minuteInterval || options.minuteInterval < 1 || options.minuteInterval > 60) {
        if (this.debugMode) {
          if (options.minuteInterval > 60) {
            this.debugLog(`"minute-interval" should be less than 60. Current value is ${this.minuteInterval}`)
          } else if (options.minuteInterval === 0 || options.minuteInterval < 1) {
            this.debugLog(`"minute-interval" should be NO less than 1. Current value is ${this.minuteInterval}`)
          }
        }
        if (options.minuteInterval === 0) {
          options.minuteInterval = 60
        } else {
          options.minuteInterval = 1
        }
      }

      if (this.isNumber(this.secondInterval)) {
        options.secondInterval = +this.secondInterval
      }
      // secondInterval failsafe
      if (!options.secondInterval || options.secondInterval < 1 || options.secondInterval > 60) {
        if (this.debugMode) {
          if (options.secondInterval > 60) {
            this.debugLog(`"second-interval" should be less than 60. Current value is ${this.secondInterval}`)
          } else if (options.secondInterval === 0 || options.secondInterval < 1) {
            this.debugLog(`"second-interval" should be NO less than 1. Current value is ${this.secondInterval}`)
          }
        }
        if (options.secondInterval === 0) {
          options.secondInterval = 60
        } else {
          options.secondInterval = 1
        }
      }

      if (this.hourRange && Array.isArray(this.hourRange)) {
        options.hourRange = JSON.parse(JSON.stringify(this.hourRange))
        if (!this.hourRange.length && this.debugMode) {
          this.debugLog('The "hour-range" array is empty (length === 0)')
        }
      }

      if (this.minuteRange && Array.isArray(this.minuteRange)) {
        options.minuteRange = JSON.parse(JSON.stringify(this.minuteRange))
        if (!this.minuteRange.length && this.debugMode) {
          this.debugLog('The "minute-range" array is empty (length === 0)')
        }
      }

      if (this.secondRange && Array.isArray(this.secondRange)) {
        options.secondRange = JSON.parse(JSON.stringify(this.secondRange))
        if (!this.secondRange.length && this.debugMode) {
          this.debugLog('The "second-range" array is empty (length === 0)')
        }
      }

      if (this.hideDisabledItems) {
        options.hideDisabledItems = true
      }

      if (this.hideDisabledHours || this.hideDisabledItems) {
        options.hideDisabledHours = true
      }
      if (this.hideDisabledMinutes || this.hideDisabledItems) {
        options.hideDisabledMinutes = true
      }
      if (this.hideDisabledSeconds || this.hideDisabledItems) {
        options.hideDisabledSeconds = true
      }

      if (this.hideDropdown) {
        if (this.manualInput) {
          options.hideDropdown = true
        } else if (this.debugMode) {
          this.debugLog('"hide-dropdown" only works with "manual-input" mode')
        }
      }

      if (this.advancedKeyboard) {
        if (!(this.hideDropdown && this.manualInput)) {
          options.advancedKeyboard = true
        } else if (this.debugMode) {
          this.debugLog('"advanced-keyboard" has no effect when dropdown is force hidden by "hide-dropdown"')
        }
      }

      if (this.blurDelay && +this.blurDelay > 0) {
        options.blurDelay = +this.blurDelay
      }

      if (this.manualInputTimeout && +this.manualInputTimeout > 0) {
        options.manualInputTimeout = +this.manualInputTimeout
      }

      return options
    },

    useStringValue () {
      return typeof this.value === 'string'
    },

    formatString () {
      return this.opts.format || DEFAULT_OPTIONS.format
    },

    displayTime () {
      let formatString = String(this.formatString)
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

    customDisplayTime () {
      if (!this.amText && !this.pmText) {
        return this.displayTime
      }
      return this.displayTime.replace(new RegExp(this.apm, 'g'), this.apmDisplayText(this.apm))
    },

    inputIsEmpty () {
      return this.formatString === this.displayTime
    },

    allValueSelected () {
      if (
        (!this.hour || !this.hour.length) ||
        (!this.minute || !this.minute.length) ||
        (this.secondType && (!this.second || !this.second.length)) ||
        (this.apmType && (!this.apm || !this.apm.length))
      ) {
        return false
      }
      return true
    },

    showClearBtn () {
      if (this.hideClearButton || this.disabled) {
        return false
      }
      return !this.inputIsEmpty
    },

    baseOn12Hours () {
      return this.hourType === 'h' || this.hourType === 'hh'
    },

    hourRangeIn24HrFormat () {
      if (!this.opts.hourRange) { return false }
      if (!this.opts.hourRange.length) { return [] }

      const range = []
      this.opts.hourRange.forEach(value => {
        if (value instanceof Array) {
          if (value.length > 2 && this.debugMode) {
            this.debugLog(`Nested array within "hour-range" must contain no more than two items. Only the first two items of ${JSON.stringify(value)} will be taken into account.`)
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
            if (i < 0 || i > 24) { continue }
            if (!range.includes(i)) {
              range.push(i)
            }
          }
        } else {
          if (this.is12hRange(value)) {
            value = this.translate12hRange(value)
          } else {
            value = +value
          }
          if (value < 0 || value > 24) { return }
          if (!range.includes(value)) {
            range.push(value)
          }
        }
      })
      range.sort((l, r) => { return l - r })
      return range
    },

    restrictedHourRange () {
      // No restriction
      if (!this.hourRangeIn24HrFormat) { return false }
      // 12-Hour
      if (this.baseOn12Hours) {
        const range = this.hourRangeIn24HrFormat.map((value) => {
          if (value === 12) {
            return '12p'
          } else if (value === 24 || value === 0) {
            return '12a'
          }
          return value > 12 ? `${value % 12}p` : `${value}a`
        })
        return range
      }
      // 24-Hour
      return this.hourRangeIn24HrFormat
    },

    validHoursList () {
      if (!this.manualInput) { return false }
      if (this.restrictedHourRange) {
        let list = []
        if (this.baseOn12Hours) {
          list = this.restrictedHourRange.map(hr => {
            const l = hr.substr(0, hr.length - 1)
            const r = hr.substr(-1)
            return `${this.formatValue(this.hourType, l)}${r}`
          })
          const am12Index = list.findIndex(hr => hr === '12a')
          if (am12Index > 0) {
            // Make '12a' the first item in h/hh
            list.unshift(list.splice(am12Index, 1)[0])
          }
          return list
        }
        list = this.restrictedHourRange.map(hr => {
          return this.formatValue(this.hourType, hr)
        })
        if (list.length > 1 && list[0] && list[0] === '24') {
          // Make '24' the last item in k/kk
          list.push(list.shift())
        }
        return list
      }
      if (this.baseOn12Hours) {
        return [].concat([], this.hours.map(hr => `${hr}a`), this.hours.map(hr => `${hr}p`))
      }
      return this.hours
    },

    has () {
      const result = {
        am: true,
        pm: true,
        customApmText: false
      }
      if (this.hourRangeIn24HrFormat && this.hourRangeIn24HrFormat.length) {
        const range = [].concat([], this.hourRangeIn24HrFormat)
        result.am = range.some(this.hasAm)
        result.pm = range.some(this.hasPm)
      }
      if ((this.amText && this.amText.length) || (this.pmText && this.pmText.length)) {
        result.customApmText = true
      }
      return result
    },

    minuteRangeList () {
      if (!this.opts.minuteRange) { return false }
      if (!this.opts.minuteRange.length) { return [] }
      const range = []
      let formatedValue
      this.opts.minuteRange.forEach(value => {
        if (value instanceof Array) {
          if (value.length > 2 && this.debugMode) {
            this.debugLog(`Nested array within "minute-range" must contain no more than two items. Only the first two items of ${JSON.stringify(value)} will be taken into account.`)
          }
          const start = value[0]
          const end = value[1] || value[0]
          for (let i = +start; i <= +end; i++) {
            if (i < 0 || i > 59) { continue }
            formatedValue = this.formatValue(this.minuteType, i)
            if (!range.includes(formatedValue)) {
              range.push(formatedValue)
            }
          }
        } else {
          if (+value < 0 || +value > 59) { return }
          formatedValue = this.formatValue(this.minuteType, value)
          if (!range.includes(formatedValue)) {
            range.push(formatedValue)
          }
        }
      })
      range.sort((l, r) => { return l - r })
      // Debug Mode
      if (this.debugMode) {
        const validItems = (this.minutes || []).filter(item => range.includes(item))
        if (!validItems || !validItems.length) {
          this.debugLog(`The minute list is empty due to the "minute-range" config\nminute-range: ${JSON.stringify(this.minuteRange)}\nminute-interval: ${this.opts.minuteInterval}`)
        }
      }
      return range
    },

    secondRangeList () {
      if (!this.opts.secondRange) { return false }
      if (!this.opts.secondRange.length) { return [] }
      const range = []
      let formatedValue
      this.opts.secondRange.forEach(value => {
        if (value instanceof Array) {
          if (value.length > 2 && this.debugMode) {
            this.debugLog(`Nested array within "second-range" must contain no more than two items. Only the first two items of ${JSON.stringify(value)} will be taken into account.`)
          }
          const start = value[0]
          const end = value[1] || value[0]
          for (let i = +start; i <= +end; i++) {
            if (i < 0 || i > 59) { continue }
            formatedValue = this.formatValue(this.secondType, i)
            if (!range.includes(formatedValue)) {
              range.push(formatedValue)
            }
          }
        } else {
          if (+value < 0 || +value > 59) { return }
          formatedValue = this.formatValue(this.secondType, value)
          if (!range.includes(formatedValue)) {
            range.push(formatedValue)
          }
        }
      })
      range.sort((l, r) => { return l - r })
      // Debug Mode
      if (this.debugMode) {
        const validItems = (this.seconds || []).filter(item => range.includes(item))
        if (!validItems || !validItems.length) {
          this.debugLog(`The second list is empty due to the "second-range" config\nsecond-range: ${JSON.stringify(this.secondRange)}\nsecond-interval: ${this.opts.secondInterval}`)
        }
      }
      return range
    },
    
    hourLabelText () {
      return this.hourLabel || this.hourType
    },
    minuteLabelText () {
      return this.minuteLabel || this.minuteType
    },
    secondLabelText() {
      return this.secondLabel || this.secondType
    },
    apmLabelText () {
      return this.apmLabel || this.apmType
    },

    inputWidthStyle () {
      if (!this.inputWidth || !this.inputWidth.length) { return }
      return {
        width: this.inputWidth
      }
    },

    tokenRegexBase () {
      if (!this.manualInput && !this.useStringValue) { return false }
      let regexStr = `${this.hourType}|${this.minuteType}`
      if (this.secondType) {
        regexStr += `|${this.secondType}`
      }
      if (this.apmType) {
        regexStr += `|${this.apmType}`
      }
      return regexStr
    },

    tokenChunks () {
      if (!this.manualInput && !this.useStringValue) { return false }

      const formatString = String(this.formatString)
      const tokensRegxStr = `[(${this.tokenRegexBase})]+`
      const tokensMatchAll = this.getMatchAllByRegex(formatString, tokensRegxStr)

      const tokenChunks = []
      for (let tkMatch of tokensMatchAll) {
        const rawToken = tkMatch[0]
        const tokenMatchItem = {
          index: tkMatch.index,
          token: rawToken,
          type: this.getTokenType(rawToken),
          needsCalibrate: rawToken.length < 2,
          len: (rawToken || '').length
        }
        tokenChunks.push(tokenMatchItem)
      }
      return tokenChunks
    },

    needsPosCalibrate () {
      if (!this.manualInput) { return false }
      return this.tokenChunks.some(chk => chk.needsCalibrate)
    },

    tokenChunksPos () {
      if (!this.manualInput) { return false }
      if (!this.needsPosCalibrate) {
        return this.tokenChunks.map(chk => {
          return {
            token: chk.token,
            type: chk.type,
            start: chk.index,
            end: chk.index + chk.len
          }
        })
      }
      const list = []
      let calibrateLen = 0
      this.tokenChunks.forEach(chk => {
        let chunkCurrentLen
        // Adjust for customized AM/PM text
        if (chk.type === 'apm' && this.has.customApmText) {
          if (this.apm && this.apm.length) {
            const customApmText = this.apm.toLowerCase() === 'am' ? this.amText : this.pmText
            chunkCurrentLen = (customApmText && customApmText.length) ? customApmText.length : chk.len
          } else {
            chunkCurrentLen = chk.len
          }
        // Others
        } else {
          chunkCurrentLen = this[chk.type] && this[chk.type].length ? this[chk.type].length : chk.len
        }
        list.push({
          token: chk.token,
          type: chk.type,
          start: chk.index + calibrateLen,
          end: chk.index + calibrateLen + chunkCurrentLen
        })
        if (chk.needsCalibrate && chunkCurrentLen > chk.len) {
          calibrateLen += (chunkCurrentLen - chk.len)
        }
      })
      return list
    },

    invalidValues () {
      if (this.inputIsEmpty) { return [] }
      if (!this.restrictedHourRange && !this.minuteRangeList && !this.secondRangeList && this.opts.minuteInterval === 1 && this.opts.secondInterval === 1) { return [] }

      const result = []
      if (!this.isEmptyValue(this.hourType, this.hour) && (!this.isValidValue(this.hourType, this.hour) || this.isDisabled('hour', this.hour))) {
        result.push('hour')
      }
      if (!this.isEmptyValue(this.minuteType, this.minute) && (!this.isValidValue(this.minuteType, this.minute) || this.isDisabled('minute', this.minute) || this.notInMinuteInterval(this.minute))) {
        result.push('minute')
      }
      if (this.secondType && !this.isEmptyValue(this.secondType, this.second) && (!this.isValidValue(this.secondType, this.second) || this.isDisabled('second', this.second) || this.notInSecondInterval(this.second))) {
        result.push('second')
      }
      if (this.apmType && !this.isEmptyValue(this.apmType, this.apm) && (!this.isValidValue(this.apmType, this.apm) || this.isDisabled('apm', this.apm))) {
        result.push('apm')
      }
      if (result.length) {
        return result
      }
      return []
    },

    hasInvalidInput () {
      return Boolean(this.invalidValues && this.invalidValues.length)
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
    value: {
      deep: true,
      handler () {
        this.readValues()
      }
    },
    displayTime () {
      this.fillValues()
    },
    disabled (toDisabled) {
      // Force close the dropdown when disabled
      if (toDisabled && this.showDropdown) {
        this.showDropdown = false
      }
    },
    'invalidValues.length' (newLength, oldLength) {
      if (newLength && newLength >= 1) {
        this.$emit('error', this.invalidValues)
      } else if (oldLength && oldLength >= 1) {
        this.$emit('error', [])
      }
    }
  },

  methods: {
    formatValue (token, i) {
      i = +i
      switch (token) {
        case 'H':
        case 'h':
        case 'k':
        case 'm':
        case 's':
          if (['h', 'k'].includes(token) && i === 0) {
            return token === 'k' ? '24' : '12'
          }
          return String(i)
        case 'HH':
        case 'mm':
        case 'ss':
        case 'hh':
        case 'kk':
          if (['hh', 'kk'].includes(token) && i === 0) {
            return token === 'kk' ? '24' : '12'
          }
          return i < 10 ? `0${i}` : String(i)
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
      } else {
        this.seconds = []
      }

      if (this.apmType) {
        this.renderApmList()
      } else {
        this.apms = []
      }

      this.$nextTick(() => {
        this.readValues()
      })
    },

    renderHoursList () {
      const hoursCount = (this.baseOn12Hours) ? 12 : 24
      const hours = []
      for (let i = 0; i < hoursCount; i++) {
        if (this.hourType === 'k' || this.hourType === 'kk') {
          hours.push(this.formatValue(this.hourType, i + 1))
        } else {
          hours.push(this.formatValue(this.hourType, i))
        }
      }
      this.hours = hours
    },

    renderList (listType, interval) {
      if (!['minute','second'].includes(listType)) { return }

      const isMinute = listType === 'minute'
      interval = interval || (isMinute ? (this.opts.minuteInterval || DEFAULT_OPTIONS.minuteInterval) : (this.opts.secondInterval || DEFAULT_OPTIONS.secondInterval))

      const result = []
      for (let i = 0; i < 60; i += interval) {
        result.push(this.formatValue(isMinute ? this.minuteType : this.secondType, i))
      }

      isMinute ? this.minutes = result : this.seconds = result
    },

    renderApmList () {
      this.apms = this.apmType === 'A' ? ['AM', 'PM'] : ['am', 'pm']
    },

    readValues () {
      if (this.useStringValue) {
        if (this.debugMode) {
          this.debugLog(`Received a string value: "${this.value}"`)
        }
        this.readStringValues(this.value)
      } else {
        if (this.debugMode) {
          this.debugLog(`Received an object value: "${JSON.stringify(this.value || {})}"`)
        }
        this.readObjectValues(this.value)
      }
    },

    readObjectValues (objValue) {
      const timeValue = JSON.parse(JSON.stringify(objValue || {}))
      const values = Object.keys(timeValue)

      // Failsafe for empty `v-model` object
      if (values.length === 0) {
        this.addFallbackValues()
        return
      }

      CONFIG.BASIC_TYPES.forEach(section => {
        const sectionType = this[`${section}Type`]
        if (values.indexOf(sectionType) > -1) {
          const sanitizedValue = this.sanitizedValue(sectionType, timeValue[sectionType])
          this[section] = sanitizedValue
          timeValue[sectionType] = sanitizedValue
        } else {
          this[section] = ''
        }
      })
      this.timeValue = timeValue
    },

    getMatchAllByRegex (testString, regexString) {
      const str = 'polyfillTest'
      const needsPolyfill = Boolean(!str.matchAll || typeof str.matchAll !== 'function')
      return needsPolyfill ? this.polyfillMatchAll(testString, regexString) : testString.matchAll(new RegExp(regexString, 'g'))
    },

    readStringValues (stringValue) {
      // Failsafe for empty `v-model` string
      if (!stringValue || !stringValue.length) {
        this.addFallbackValues()
        return
      }

      const formatString = String(this.formatString)
      const tokensRegxStr = `[(${this.tokenRegexBase})]+`
      const othersRegxStr = `[^(${this.tokenRegexBase})]+`

      const tokensMatchAll = this.getMatchAllByRegex(formatString, tokensRegxStr)
      const othersMatchAll = this.getMatchAllByRegex(formatString, othersRegxStr)

      const chunks = []
      const tokenChunks = []

      for (let tkMatch of tokensMatchAll) {
        const tokenMatchItem = {
          index: tkMatch.index,
          token: tkMatch[0],
          isValueToken: true
        }
        chunks.push(tokenMatchItem)
        tokenChunks.push(tokenMatchItem)
      }

      for (let otMatch of othersMatchAll) {
        chunks.push({
          index: otMatch.index,
          token: otMatch[0]
        })
      }

      chunks.sort((l, r) => l.index < r.index ? -1 : 1)

      let regexCombo = ''
      chunks.forEach(chunk => {
        if (chunk.isValueToken) {
          const tokenRegex = this.getTokenRegex(chunk.token) || ''
          regexCombo += tokenRegex
        } else {
          const safeChars = chunk.token.replace(/\\{0}(\*|\?|\.|\+)/g, '\\$1')
          regexCombo += `(?:${safeChars})`
        }
      })

      const comboReg = new RegExp(regexCombo)

      // Do test before match
      if (comboReg.test(stringValue)) {
        const matchResults = stringValue.match(new RegExp(regexCombo))
        const valueResults = matchResults.slice(1, tokenChunks.length + 1)
        const timeValue = {}
        valueResults.forEach((value, vrIndex) => {
          if (tokenChunks[vrIndex]) {
            const targetToken = tokenChunks[vrIndex].token
            timeValue[targetToken] = this.setValueFromString(value, targetToken)
          }
        })
        this.timeValue = timeValue

        if (this.debugMode) {
          const tokenChunksForLog = tokenChunks.map(tChunk => tChunk && tChunk.token)
          this.debugLog(`Successfully parsed values ${JSON.stringify(valueResults)}\nfor ${JSON.stringify(tokenChunksForLog)}\nin format pattern '${this.formatString}'`)
        }
      } else {
        if (this.debugMode) {
          this.debugLog(`The input string in "v-model" does NOT match the "format" pattern\nformat: ${this.formatString}\nv-model: ${stringValue}`)
        }
      }
    },

    polyfillMatchAll (targetString, regxStr) {
      const matchesList = targetString.match(new RegExp(regxStr, 'g'))
      const result = []
      const indicesReg = []
      if (matchesList && matchesList.length) {
        matchesList.forEach(matchedItem => {
          const existIndex = indicesReg.findIndex(idxItem => idxItem.str === matchedItem)
          let index
          if (existIndex >= 0) {
            if (indicesReg[existIndex] && indicesReg[existIndex].regex) {
              index = indicesReg[existIndex].regex.exec(targetString).index
            }
          } else {
            const itemIndicesRegex = new RegExp(matchedItem, 'g')
            index = itemIndicesRegex.exec(targetString).index
            indicesReg.push({
              str: String(matchedItem),
              regex: itemIndicesRegex
            })
          }
          result.push({
            0: String(matchedItem),
            index: index
          })
        })
      }
      return result
    },

    addFallbackValues () {
      const timeValue = {}
      timeValue[this.hourType] = ''
      timeValue[this.minuteType] = ''
      if (this.secondType) {
        timeValue[this.secondType] = ''
      }
      if (this.apmType) {
        timeValue[this.apmType] = ''
      }
      this.timeValue = timeValue
    },

    setValueFromString (parsedValue, token) {
      if (!token || !parsedValue) { return '' }
      const tokenType = this.getTokenType(token)
      if (!tokenType || !tokenType.length) { return '' }
      const stdValue = (parsedValue !== this[`${tokenType}Type`]) ? parsedValue : ''
      this[tokenType] = stdValue
      return stdValue
    },

    fillValues (forceEmit) {
      const fullValues = {}

      const baseHour = this.hour
      const baseHourType = this.hourType

      const hourValue = this.isNumber(baseHour) ? +baseHour : ''
      const apmValue = (this.baseOn12Hours && this.apm) ? this.lowerCasedApm(this.apm) : false

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
              } else if (hourValue > 11 && hourValue < 24) {
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

      if (this.isNumber(this.minute)) {
        const minuteValue = +this.minute
        fullValues.m = String(minuteValue)
        fullValues.mm = minuteValue < 10 ? `0${minuteValue}` : String(minuteValue)
      } else {
        fullValues.m = ''
        fullValues.mm = ''
      }

      if (this.isNumber(this.second)) {
        const secondValue = +this.second
        fullValues.s = String(secondValue)
        fullValues.ss = secondValue < 10 ? `0${secondValue}` : String(secondValue)
      } else {
        fullValues.s = ''
        fullValues.ss = ''
      }

      this.fullValues = fullValues

      // On lazy mode, emit `input` and `change` events only when:
      // - The user pick a new value and then close the dropdown
      // - The user click the ("x") clear button
      if (!this.lazy || forceEmit) {
        this.emitTimeValue()
      }

      if (this.closeOnComplete && this.allValueSelected && this.showDropdown) {
        this.toggleDropdown()
      }
    },

    emitTimeValue () {
      if (!this.fullValues) { return }

      if (this.lazy && this.bakDisplayTime === this.displayTime) {
        if (this.debugMode) {
          this.debugLog('The value does not change on `lazy` mode. Skip the emitting `input` and `change` event.')
        }
        return
      }

      const fullValues = JSON.parse(JSON.stringify(this.fullValues))
      const baseTimeValue = JSON.parse(JSON.stringify(this.timeValue || {}))
      const timeValue = {}

      Object.keys(baseTimeValue).forEach((key) => {
        timeValue[key] = fullValues[key] || ''
      })

      if (this.useStringValue) {
        this.$emit('input', this.inputIsEmpty ? '' : String(this.displayTime))
      } else {
        this.$emit('input', JSON.parse(JSON.stringify(timeValue)))
      }

      this.$emit('change', {
        data: fullValues,
        displayTime: this.inputIsEmpty ? '' : String(this.displayTime)
      })
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

    isDisabled (type, value) {
      if (!this.isBasicType(type)) { return true }
      switch (type) {
        case 'hour':
          return this.isDisabledHour(value)
        case 'minute':
        case 'second':
          if (!this[`${type}RangeList`]) {
            return false
          }
          return !this[`${type}RangeList`].includes(value)
        case 'apm':
          if (!this.restrictedHourRange) {
            return false
          }
          return !this.has[this.lowerCasedApm(value)]
        default:
          return true
      }
    },

    isDisabledHour (value) {
      if (!this.restrictedHourRange) { return false }
      if (this.baseOn12Hours) {
        if (!this.apm || !this.apm.length) {
          return false
        } else {
          const token = this.apm.toLowerCase() === 'am' ? 'a' : 'p'
          return !this.restrictedHourRange.includes(`${+value}${token}`)
        }
      }
      // Fallback for 'HH' and 'H hour format with a `hour-range` in a 12-hour form
      if (
        (this.hourType === 'HH' || this.hourType === 'H') &&
        +value === 0 && this.restrictedHourRange.includes(24)
      ) {
        return false
      }
      return !this.restrictedHourRange.includes(+value)
    },

    notInMinuteInterval (value) {
      if (this.opts.minuteInterval === 1) { return false }
      return +value % this.opts.minuteInterval !== 0
    },

    notInSecondInterval (value) {
      if (this.opts.secondInterval === 1) { return false }
      return +value % this.opts.secondInterval !== 0
    },

    forceApmSelection () {
      if (!this.apm || !this.apm.length) {
        if (this.manualInput) {
          // In Manual Input Mode
          // Skip this to allow users to paste a string value from clipboard
          return
        }
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

    apmDisplayText (apmValue) {
      if (this.amText && this.lowerCasedApm(apmValue) === 'am') {
        return this.amText
      }
      if (this.pmText && this.lowerCasedApm(apmValue) === 'pm') {
        return this.pmText
      }
      return apmValue
    },

    toggleDropdown () {
      if (this.disabled) { return }
      this.showDropdown = !this.showDropdown

      if (this.showDropdown) {
        if (!this.opts.hideDropdown) {
          this.$emit('open')
        }
        this.isFocusing = true
        this.$emit('focus')
        // Record to check if value did changed in the later phase
        if (this.lazy) {
          this.bakDisplayTime = String(this.displayTime || '')
        }
      } else {
        if (!this.opts.hideDropdown) {
          this.$emit('close')
        }
        this.isFocusing = false
        this.$emit('blur')
        if (this.lazy) {
          this.fillValues(true)
          this.bakDisplayTime = undefined
        }
      }

      if (this.showDropdown) {
        if (this.manualInput) { return }
        if (this.restrictedHourRange && this.baseOn12Hours) {
          this.forceApmSelection()
        }
        this.checkForAutoScroll()
      } else if (this.restrictedHourRange && this.baseOn12Hours) {
        this.emptyApmSelection()
      }
    },

    select (type, value) {
      if (this.isBasicType(type) && !this.isDisabled(type, value)) {
        this[type] = value
      }
    },

    clearTime () {
      if (this.disabled) { return }
      this.hour = ''
      this.minute = ''
      this.second = ''
      this.apm = ''

      if (this.manualInput && this.$refs && this.$refs.input && this.$refs.input.value.length) {
        this.$refs.input.value = ''
      }

      if (this.lazy) {
        this.fillValues(true)
      }
    },

    //
    // Auto-Scroll
    //

    checkForAutoScroll () {
      if (this.inputIsEmpty) { return }
      if (this.autoScroll) {
        this.$nextTick(() => {
          this.scrollToSelectedValues()
        })
      } else if (this.opts.advancedKeyboard) {
        // Auto-focus on selected hour value for advanced-keyboard
        this.$nextTick(() => {
          this.scrollToSelected('hours')
        })
      }
    },

    scrollToSelected (columnClass) {
      if (!this.timeValue || this.inputIsEmpty) { return }
      const targetList = this.$el.querySelectorAll(`ul.${columnClass}`)[0]
      const targetValue = this.$el.querySelectorAll(`ul.${columnClass} li.active:not(.hint)`)[0]
      if (targetList && targetValue) {
        targetList.scrollTop = targetValue.offsetTop || 0
        if (this.opts.advancedKeyboard && columnClass === 'hours') {
          targetValue.focus()
        }
      }
    },

    scrollToSelectedValues () {
      if (!this.timeValue || this.inputIsEmpty) { return }
      this.scrollToSelected('hours')
      this.scrollToSelected('minutes')
      if (this.secondType) {
        this.scrollToSelected('seconds')
      }
    },

    //
    // Additional Keyboard Navigation
    //

    onFocus () {
      if (this.disabled) { return }
      if (!this.isFocusing) {
        this.isFocusing = true
      }
      if (!this.showDropdown) {
        this.toggleDropdown()
      }
    },

    escBlur () {
      if (this.disabled) { return }
      this.isFocusing = false
      const inputBox = this.$el.querySelectorAll('input.display-time')[0]
      if (inputBox) {
        inputBox.blur()
      }
    },

    debounceBlur () {
      if (this.disabled) { return }
      this.isFocusing = false
      window.clearTimeout(this.debounceTimer)
      this.debounceTimer = window.setTimeout(() => {
        window.clearTimeout(this.debounceTimer)
        this.onBlur()
      }, this.opts.blurDelay)
    },

    onBlur () {
      if (this.disabled) { return }
      if (!this.isFocusing) {
        if (this.showDropdown) {
          this.toggleDropdown()
        }
      }
    },

    keepFocusing () {
      if (!this.isFocusing) {
        this.isFocusing = true
      }
    },

    validItemsInCol (columnClass) {
      return this.$el.querySelectorAll(`ul.${columnClass} > li:not(.hint):not([disabled])`)
    },

    activeItemInCol (columnClass) {
      return this.$el.querySelectorAll(`ul.${columnClass} > li.active:not(.hint)`)
    },

    getClosestSibling (columnClass, dataKey, getPrevious = false) {
      const siblingsInCol = this.validItemsInCol(columnClass)
      const selfIndex = Array.prototype.findIndex.call(siblingsInCol, (sbl) => {
        return sbl.getAttribute('data-key') === dataKey
      })

      // Already the first item
      if (getPrevious && selfIndex === 0) {
        return siblingsInCol[siblingsInCol.length - 1]
      }
      // Already the last item
      if (!getPrevious && selfIndex === siblingsInCol.length - 1) {
        return siblingsInCol[0]
      }
      // Selected value not in the valid values list
      if (selfIndex < 0) {
        return siblingsInCol[0]
      }

      if (getPrevious) {
        return siblingsInCol[selfIndex - 1]
      }
      return siblingsInCol[selfIndex + 1]
    },

    prevItem (columnClass, dataKey, isManualInput = false) {
      const targetItem = this.getClosestSibling(columnClass, dataKey, true)
      if (targetItem) {
        return isManualInput ? targetItem : targetItem.focus()
      }
    },

    nextItem (columnClass, dataKey, isManualInput = false) {
      const targetItem = this.getClosestSibling(columnClass, dataKey, false)
      if (targetItem) {
        return isManualInput ? targetItem : targetItem.focus()
      }
    },

    getSideColumnClass (columnClass, toLeft = false) {
      let targetColumn
      // Nav to Left
      if (toLeft) {
        switch (columnClass) {
          case 'hours':
            targetColumn = -1
            break
          case 'minutes':
            targetColumn = 'hours'
            break
          case 'seconds':
            targetColumn = 'minutes'
            break
          case 'apms':
            if (this.secondType) {
              targetColumn = 'seconds'
            } else {
              targetColumn = 'minutes'
            }
            break
        }
      // Nav to Right
      } else {
        switch (columnClass) {
          case 'hours':
            targetColumn = 'minutes'
            break
          case 'minutes':
            if (this.secondType) {
              targetColumn = 'seconds'
            } else if (this.apmType) {
              targetColumn = 'apms'
            } else {
              targetColumn = 1
            }
            break
          case 'seconds':
            if (this.apmType) {
              targetColumn = 'apms'
            } else {
              targetColumn = 1
            }
            break
          case 'apms':
            targetColumn = 1
            break
        }
      }

      if (targetColumn === -1) {
        if (this.debugMode) {
          this.debugLog('You\'re in the leftmost list already')
        }
        return
      } else if (targetColumn === 1) {
        if (this.debugMode) {
          this.debugLog('You\'re in the rightmost list already')
        }
        return
      }

      return targetColumn
    },

    getFirstItemInSideColumn (columnClass, toLeft = false) {
      const targetColumnClass = this.getSideColumnClass(columnClass, toLeft)
      if (!targetColumnClass) { return }
      const listItems = this.validItemsInCol(targetColumnClass)
      if (listItems && listItems[0]) {
        return listItems[0]
      }
    },

    getActiveItemInSideColumn (columnClass, toLeft = false) {
      const targetColumnClass = this.getSideColumnClass(columnClass, toLeft)
      if (!targetColumnClass) { return }
      const activeItems = this.activeItemInCol(targetColumnClass)
      if (activeItems && activeItems[0]) {
        return activeItems[0]
      }
    },

    toLeftColumn (columnClass) {
      const targetItem = this.getActiveItemInSideColumn(columnClass, true) || this.getFirstItemInSideColumn(columnClass, true)
      if (targetItem) {
        targetItem.focus()
      }
    },

    toRightColumn (columnClass) {
      const targetItem = this.getActiveItemInSideColumn(columnClass, false) || this.getFirstItemInSideColumn(columnClass, false)
      if (targetItem) {
        targetItem.focus()
      }
    },

    //
    // Manual Input
    //

    onMouseDown () {
      if (!this.manualInput) { return }
      window.clearTimeout(this.selectionTimer)
      this.selectionTimer = window.setTimeout(() => {
        window.clearTimeout(this.selectionTimer)
        if (this.$refs && this.$refs.input) {
          const nearestSlot = this.getNearestChunkByPos(this.$refs.input.selectionStart || 0)
          this.debounceSetInputSelection(nearestSlot)
        }
      }, 50)
    },

    keyDownHandler (evt) {
      if (evt.isComposing || evt.keyCode === 229) {
        // Skip IME inputs
        evt.preventDefault()
        evt.stopPropagation()
        return false
      }
      // Numbers
      if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105)) {
        evt.preventDefault()
        this.keyboardInput(evt.key)
      // A|P|M
      } else if ([65, 80, 77].includes(evt.keyCode)) {
        evt.preventDefault()
        this.keyboardInput(evt.key, true)
      // Arrow keys
      } else if (evt.keyCode >= 37 && evt.keyCode <= 40) {
        evt.preventDefault()
        this.clearKbInputLog()
        this.arrowHandler(evt)
      // Delete|Backspace
      } else if (evt.keyCode === 8 || evt.keyCode === 46) {
        evt.preventDefault()
        this.clearKbInputLog()
        this.clearTime()
      // Tab
      } else if (evt.keyCode === 9) {
        this.clearKbInputLog()
        this.tabHandler(evt)
      // Prevent any Non-ESC and non-pasting inputs
      } else if (evt.keyCode !== 27 && !(evt.metaKey || evt.ctrlKey)) {
        evt.preventDefault()
      }
    },

    onCompostionStart (evt) {
      evt.preventDefault()
      evt.stopPropagation()
      this.bakCurrentPos = this.getCurrentTokenChunk()
      return false
    },

    onCompostionEnd (evt) {
      evt.preventDefault()
      evt.stopPropagation()

      const cpsData = evt.data
      let inputIsCustomApmText = false
      if (this.has.customApmText) {
        inputIsCustomApmText = this.isCustomApmText(cpsData)
      }
      if (inputIsCustomApmText) {
        this.setSanitizedValueToSection('apm', inputIsCustomApmText)
      }

      this.$refs.input.value = this.has.customApmText ? this.customDisplayTime : this.displayTime

      this.$nextTick(() => {
        if (this.bakCurrentPos) {
          const bakPos = JSON.parse(JSON.stringify(this.bakCurrentPos))
          if (inputIsCustomApmText) {
            bakPos.end = (bakPos.start + cpsData.length)
          }
          this.debounceSetInputSelection(bakPos)
          this.bakCurrentPos = null
        }
      })
      return false
    },

    pasteHandler (evt) {
      evt.preventDefault()
      let pastingText = (evt.clipboardData || window.clipboardData).getData('text')
      if (this.debugMode) {
        this.debugLog(`Pasting value "${pastingText}" from clipboard`)
      }
      if (!pastingText || !pastingText.length) { return }

      // Replace custom AM/PM text (if any)
      if (this.has.customApmText) {
        pastingText = this.replaceCustomApmText(pastingText)
      }

      if (this.inputIsEmpty) {
        this.readStringValues(pastingText)
      } else {
        this.kbInputLog = pastingText.substr(-2, 2)
        this.setKbInput()
        this.debounceClearKbLog()
      }
    },

    arrowHandler (evt) {
      const direction = { 37: 'L', 38: 'U', 39: 'R', 40: 'D' }[evt.keyCode]
      if (direction === 'U' || direction === 'D') {
        if (this.inputIsEmpty) {
          this.selectFirstValidValue()
        } else {
          const currentChunk = this.getCurrentTokenChunk()
          if (!currentChunk) {
            this.selectFirstValidValue()
            return
          }
          const tokenType = currentChunk.type
          this.getClosestValidItemInCol(tokenType, this[tokenType], direction)
          const newChunkPos = this.getCurrentTokenChunk()
          this.debounceSetInputSelection(newChunkPos)
        }
      } else if (direction === 'R') {
        this.toLateralToken(false)
      } else if (direction === 'L') {
        this.toLateralToken(true)
      }
    },

    tabHandler (evt) {      
      if (!this.inputIsEmpty && this.tokenChunksPos && this.tokenChunksPos.length) {
        const currentChunk = this.getCurrentTokenChunk()
        if (!currentChunk) { return }
        const firstChunk = this.tokenChunksPos[0];
        const lastChunk = this.tokenChunksPos[this.tokenChunksPos.length - 1]
        if ((evt.shiftKey && currentChunk.token !== firstChunk.token) || (!evt.shiftKey && currentChunk.token !== lastChunk.token)) {
          evt.preventDefault()
          this.toLateralToken(evt.shiftKey)
        }
      }
    },

    keyboardInput (newChar, isApm = false) {
      const currentChunk = this.getCurrentTokenChunk()
      if (!currentChunk || (currentChunk.type !== 'apm' && isApm) || (currentChunk.type === 'apm' && !isApm)) { return }
      this.kbInputLog = `${this.kbInputLog.substr(-1)}${newChar}`
      this.setKbInput()
      this.debounceClearKbLog()
    },

    clearKbInputLog () {
      window.clearTimeout(this.kbInputTimer)
      this.kbInputLog = ''
    },

    debounceClearKbLog () {
      window.clearTimeout(this.kbInputTimer)
      this.kbInputTimer = window.setTimeout(() => {
        this.clearKbInputLog()
      }, this.opts.manualInputTimeout)
    },

    setKbInput (value) {
      value = value || this.kbInputLog
      const currentChunk = this.getCurrentTokenChunk()
      if (!currentChunk || !value || !value.length) { return }
      const chunkType = currentChunk.type
      const chunkToken = currentChunk.token

      let validValue
      if (chunkType === 'apm') {
        if (this.lowerCasedApm(value).includes('a')) {
          validValue = 'am'
        } else if (this.lowerCasedApm(value).includes('p')) {
          validValue = 'pm'
        }
        if (validValue) {
          validValue = chunkToken === 'A' ? validValue.toUpperCase() : validValue
        }
      } else {
        if (this.isValidValue(chunkToken, value)) {
          validValue = value
        } else {
          const lastInputValue = this.formatValue(chunkToken, value.substr(-1))
          if (this.isValidValue(chunkToken, lastInputValue)) {
            validValue = lastInputValue
          }
        }
      }

      if (validValue) {
        this.setSanitizedValueToSection(chunkType, validValue)
        const newChunkPos = this.getCurrentTokenChunk()
        this.debounceSetInputSelection(newChunkPos)      
      }
      if (this.debugMode) {
        if (validValue) {
          this.debugLog(`Successfully set value "${validValue}" from latest input "${value}" for the "${chunkType}" slot`)
        } else {
          this.debugLog(`Value "${value}" is invalid in the "${chunkType}" slot`)
        }
      }
    },

    // Form Autofill
    onChange () {
      if (!this.$refs || !this.$refs.input || !this.manualInput) { return }
      const autoFillValue = this.$refs.input.value || ''
      if (autoFillValue && autoFillValue.length) {
        this.readStringValues(autoFillValue)
      }
    },

    getNearestChunkByPos (startPos) {
      if (!this.tokenChunksPos || !this.tokenChunksPos.length) { return }
      let nearest
      let nearestDelta = -1
      for (let i = 0; i < this.tokenChunksPos.length; i++) {
        const chunk = JSON.parse(JSON.stringify(this.tokenChunksPos[i]))
        if (chunk.start === startPos) {
          return chunk
        }
        const delta = Math.abs(chunk.start - startPos)
        if (nearestDelta < 0) {
          nearest = chunk
          nearestDelta = delta
        } else {
          if (nearestDelta <= delta) {
            return nearest
          }
          nearestDelta = delta
          nearest = chunk
        }
      }
      return nearest
    },

    selectFirstValidValue () {
      if (!this.tokenChunksPos || !this.tokenChunksPos.length) { return }
      const firstTokenType = this.tokenChunksPos[0].type
      if (firstTokenType) {
        this.selectFirstValidValueInCol(firstTokenType)   
      }
    },

    selectFirstValidValueInCol (tokenType) {
      if (tokenType === 'hour') {
        this.selectFirstValidHour()
      } else {
        this.getClosestValidItemInCol(tokenType, this[tokenType])
      }
    },

    selectFirstValidHour () {
      if (!this.validHoursList || !this.validHoursList.length) { return }

      const hourChunk = this.tokenChunksPos.find(chk => chk.token === this.hourType)
      if (!hourChunk) { return }
      const hourToken = hourChunk.token

      this.setManualHour(this.validHoursList[0])
      const newChunkPos = this.getChunkPosByToken(hourToken)
      this.debounceSetInputSelection(newChunkPos)
    },

    getClosestValidItemInCol (column, currentValue, direction = 'U') {
      if (column === 'hour') {
        if (!this.validHoursList || !this.validHoursList.length) {
          if (this.debugMode) {
            this.debugLog(`No valid hour values found, please check your "hour-range" config\nhour-range: ${JSON.stringify(this.hourRange)}`)
          }
          return
        }
        const currentIndex = this.validHoursList.findIndex(item => {
          if (!this.baseOn12Hours) {
            return item === currentValue
          } else {
            const valueKey = `${currentValue}${this.lowerCasedApm(this.apm) === 'pm' ? 'p' : 'a'}` 
            return item === valueKey
          }
        })
        let nextIndex
        if (currentIndex === -1) {
          nextIndex = 0
        } else if (direction === 'D') {
          nextIndex = currentIndex === 0 ? this.validHoursList.length - 1 : currentIndex - 1
        } else {
          nextIndex = (currentIndex + 1) % this.validHoursList.length
        }
        const nextItem = this.validHoursList[nextIndex]
        this.setManualHour(nextItem)
      } else {
        const nextItem = direction === 'D' ? this.prevItem(`${column}s`, this[column], true) : this.nextItem(`${column}s`, this[column], true)
        if (nextItem) {
          this.select(column, nextItem.getAttribute('data-key'))
        }
      }
    },

    setSanitizedValueToSection (section, inputValue) {
      if (!section || !this[`${section}Type`]) { return }
      // NOTE: Disabled values are allowed here, followed by an 'error' event, though
      const sanitizedValue = this.sanitizedValue(this[`${section}Type`], inputValue)
      this[section] = sanitizedValue
    },

    setManualHour (nextItem) {
      if (this.is12hRange(nextItem)) {
        const hourT = nextItem.match(/^(\d{1,2})(a|p|A|P)$/)
        const apmValue = hourT[2] === 'a' ? 'AM' : 'PM'
        this.setSanitizedValueToSection('apm', this.apmType === 'a' ? apmValue.toLowerCase() : apmValue)
        this.setSanitizedValueToSection('hour', hourT[1])
      } else {
        this.setSanitizedValueToSection('hour', nextItem)
      }
    },

    debounceSetInputSelection ({start = 0, end = 0 }) {
      this.$nextTick(() => {
        this.setInputSelectionRange(start, end)
      })
      window.clearTimeout(this.selectionTimer)
      this.selectionTimer = window.setTimeout(() => {
        window.clearTimeout(this.selectionTimer)
        // Double-check selection for 12hr format
        if (this.$refs.input && (this.$refs.input.selectionStart !== start || this.$refs.input.selectionEnd !== end)) {
          this.setInputSelectionRange(start, end)
        }
      }, 30)
    },

    setInputSelectionRange (start, end) {
      if (this.$refs && this.$refs.input) {
        this.$refs.input.setSelectionRange(start, end)
      }
    },

    getCurrentTokenChunk () {
      return this.getNearestChunkByPos((this.$refs.input && this.$refs.input.selectionStart) || 0)
    },

    getChunkPosByToken (token) {
      if (!this.tokenChunksPos || !token) { return { start: 0, end: 0 } }
      const targetChunk = this.tokenChunksPos.find(chk => chk.token === token)
      return targetChunk ? targetChunk : { start: 0, end: 0 }
    },

    toLateralToken (toLeft) {
      const currentChunk = this.getCurrentTokenChunk()
      if (!currentChunk) {
        this.selectFirstValidValue()
        return
      }
      const currentChunkIndex = this.tokenChunksPos.findIndex(chk => chk.start === currentChunk.start)
      if ((!toLeft && currentChunkIndex >= this.tokenChunksPos.length - 1) || (toLeft && currentChunkIndex === 0)) {
        if (this.debugMode) {
          if (toLeft) {
            this.debugLog('You\'re in the leftmost slot already')
          } else {
            this.debugLog('You\'re in the rightmost slot already')
          }
        }
        return
      }
      const targetSlotPos = toLeft ? this.tokenChunksPos[currentChunkIndex - 1] : this.tokenChunksPos[currentChunkIndex + 1]
      this.debounceSetInputSelection(targetSlotPos)
    },

    isCustomApmText (inputData) {
      if (!inputData || !inputData.length) { return false }
      if (this.amText && this.amText === inputData) {
        return this.apmType === 'A' ? 'AM' : 'am'
      }
      if (this.pmText && this.pmText === inputData) {
        return this.apmType === 'A' ? 'PM' : 'pm'
      }
      return false
    },

    replaceCustomApmText (inputString) {
      if (this.amText && this.amText.length && inputString.includes(this.amText)) {
        return inputString.replace(new RegExp(this.amText, 'g'), this.apmType === 'A' ? 'AM' : 'am')
      } else if (this.pmText && this.pmText.length && inputString.includes(this.pmText)) {
        return inputString.replace(new RegExp(this.pmText, 'g'), this.apmType === 'A' ? 'PM' : 'pm')
      }
      return inputString
    },

    //
    // Helpers
    //

    is12hRange (value) {
      return /^\d{1,2}(a|p|A|P)$/.test(value)
    },

    isNumber (value) {
      return !isNaN(parseFloat(value)) && isFinite(value)
    },

    isBasicType (type) {
      return CONFIG.BASIC_TYPES.includes(type)
    },

    lowerCasedApm (apmValue) {
      return (apmValue || '').toLowerCase()
    },

    getTokenRegex (token) {
      switch (token) {
        case 'HH':
          return '([01][0-9]|2[0-3]|H{2})'
        case 'H':
          return '([0-9]{1}|1[0-9]|2[0-3]|H{1})'
        case 'hh':
          return '(0[1-9]|1[0-2]|h{2})'
        case 'h':
          return '([1-9]{1}|1[0-2]|h{1})'
        case 'kk':
          return '(0[1-9]|1[0-9]|2[0-4]|k{2})'
        case 'k':
          return '([1-9]{1}|1[0-9]|2[0-4]|k{1})'
        case 'mm':
          return '([0-5][0-9]|m{2})'
        case 'ss':
          return '([0-5][0-9]|s{2})'
        case 'm':
          return '([0-9]{1}|[1-5][0-9]|m{1})'
        case 's':
          return '([0-9]{1}|[1-5][0-9]|s{1})'
        case 'A':
          return '(AM|PM|A{1})'
        case 'a':
          return '(am|pm|a{1})'
        default:
          return ''
      }
    },

    isEmptyValue (targetToken, testValue) {
      return (!testValue || !testValue.length) || (testValue && testValue === targetToken)
    },

    isValidValue (targetToken, testValue) {
      if (!targetToken || this.isEmptyValue(targetToken, testValue)) { return false }
      const tokenRegexStr = this.getTokenRegex(targetToken)
      if (!tokenRegexStr || !tokenRegexStr.length) { return false }
      return (new RegExp(`^${tokenRegexStr}$`)).test(testValue)
    },

    sanitizedValue (targetToken, inputValue) {
      if (this.isValidValue(targetToken, inputValue)) {
        return inputValue
      }
      return ''
    },

    getTokenType (token) {
      const typesInUse = CONFIG.BASIC_TYPES.filter(tokenType => this[`${tokenType}Type`])
      const activeTokens = typesInUse.map(tokenType => this[`${tokenType}Type`])
      return typesInUse[activeTokens.indexOf(token)] || ''
    },

    debugLog (logText) {
      if (!logText || !logText.length) { return }
      let identifier = ''
      if (this.id) {
        identifier += `#${this.id}`
      }
      if (this.name) {
        identifier += `[name=${this.name}]`
      }
      if (this.inputClass) {
        let inputClasses = []
        if (typeof this.inputClass === 'string') {
          inputClasses = this.inputClass.split(/\s/g)
        } else if (Array.isArray(this.inputClass)) {
          inputClasses = [].concat([], this.inputClass)
        } else if (typeof this.inputClass === 'object') {
          Object.keys(this.inputClass).forEach(clsName => {
            if (this.inputClass[clsName]) {
              inputClasses.push(clsName)
            }
          })
        }
        for (let inputClass of inputClasses) {
          if (inputClass && inputClass.trim().length) {
            identifier += `.${inputClass.trim()}`
          }
        }
      }
      const finalLogText = `DEBUG: ${logText}${identifier ? `\n\t(${identifier})` : '' }`
      if (window.console.debug && typeof window.console.debug === 'function') {
        window.console.debug(finalLogText)
      } else {
        window.console.log(finalLogText)
      }
    }
  },

  mounted () {
    window.clearTimeout(this.debounceTimer)
    window.clearTimeout(this.selectionTimer)
    window.clearTimeout(this.kbInputTimer)
    this.renderFormat()
  },

  beforeDestroy () {
    window.clearTimeout(this.debounceTimer)
    window.clearTimeout(this.selectionTimer)
    window.clearTimeout(this.kbInputTimer)
  }
}
</script>

<template>
<span class="vue__time-picker time-picker" :style="inputWidthStyle">
  <input type="text" class="display-time" ref="input"
         :class="[inputClass, {'is-empty': inputIsEmpty, 'invalid': hasInvalidInput, 'all-selected': allValueSelected, 'disabled': disabled}]"
         :style="inputWidthStyle"
         :id="id"
         :name="name"
         :value="inputIsEmpty ? null : customDisplayTime"
         :placeholder="placeholder ? placeholder : formatString"
         :tabindex="disabled ? -1 : tabindex"
         :disabled="disabled"
         :readonly="!manualInput"
         :autocomplete="autocomplete"
         @focus="onFocus"
         @change="onChange"
         @blur="debounceBlur"
         @mousedown="onMouseDown"
         @keydown="keyDownHandler"
         @compositionstart="onCompostionStart"
         @compositionend="onCompostionEnd"
         @paste="pasteHandler"
         @keydown.esc.exact="escBlur" />
  <span class="clear-btn" v-if="!showDropdown && showClearBtn" @click="clearTime" tabindex="-1">&times;</span>
  <div class="time-picker-overlay" v-if="showDropdown" @click="toggleDropdown" tabindex="-1"></div>
  <div class="dropdown" v-show="showDropdown && !opts.hideDropdown" :style="inputWidthStyle" tabindex="-1" @mouseup="keepFocusing" @click.stop="">
    <div class="select-list" :style="inputWidthStyle" tabindex="-1">
      <!-- Common Keyboard Support: less event listeners -->
      <template v-if="!opts.advancedKeyboard">
        <ul class="hours" @scroll="keepFocusing">
          <li class="hint" v-text="hourLabelText"></li>
          <template v-for="(hr, hIndex) in hours">
            <li v-if="!opts.hideDisabledHours || (opts.hideDisabledHours && !isDisabled('hour', hr))"
                :key="hIndex"
                :class="{active: hour === hr}"
                :disabled="isDisabled('hour', hr)"
                :data-key="hr"
                v-text="hr"
                @click="select('hour', hr)"></li>
          </template>
        </ul>
        <ul class="minutes" @scroll="keepFocusing">
          <li class="hint" v-text="minuteLabelText"></li>
          <template v-for="(m, mIndex) in minutes">
            <li v-if="!opts.hideDisabledMinutes || (opts.hideDisabledMinutes && !isDisabled('minute', m))"
                :key="mIndex"
                :class="{active: minute === m}"
                :disabled="isDisabled('minute', m)"
                :data-key="m"
                v-text="m"
                @click="select('minute', m)"></li>
          </template>
        </ul>
        <ul class="seconds" v-if="secondType" @scroll="keepFocusing">
          <li class="hint" v-text="secondLabelText"></li>
          <template v-for="(s, sIndex) in seconds">
            <li v-if="!opts.hideDisabledSeconds || (opts.hideDisabledSeconds && !isDisabled('second', s))"
                :key="sIndex"
                :class="{active: second === s}"
                :disabled="isDisabled('second', s)"
                :data-key="s"
                v-text="s"
                @click="select('second', s)"></li>
          </template>
        </ul>
        <ul class="apms" v-if="apmType" @scroll="keepFocusing">
          <li class="hint" v-text="apmLabelText"></li>
          <template v-for="(a, aIndex) in apms">
            <li v-if="!opts.hideDisabledHours || (opts.hideDisabledHours && !isDisabled('apm', a))"
                :key="aIndex"
                :class="{active: apm === a}"
                :disabled="isDisabled('apm', a)"
                :data-key="a"
                v-text="apmDisplayText(a)"
                @click="select('apm', a)"></li>
          </template>
        </ul>
      </template><!-- / Common Keyboard Support -->

      <!--
        Advanced Keyboard Support
        Addeds hundreds of additional event lisenters
      -->
      <template v-if="opts.advancedKeyboard">
        <ul class="hours" tabindex="-1" @scroll="keepFocusing">
          <li class="hint" v-text="hourLabelText" tabindex="-1"></li>
          <template v-for="(hr, hIndex) in hours">
            <li v-if="!opts.hideDisabledHours || (opts.hideDisabledHours && !isDisabled('hour', hr))"
                :key="hIndex"
                :class="{active: hour === hr}"
                :tabindex="isDisabled('hour', hr) ? -1 : tabindex"
                :data-key="hr"
                :disabled="isDisabled('hour', hr)"
                v-text="hr"
                @click="select('hour', hr)"
                @keydown.space.prevent="select('hour', hr)"
                @keydown.enter.prevent="select('hour', hr)"
                @keydown.up.prevent="prevItem('hours', hr)"
                @keydown.down.prevent="nextItem('hours', hr)"
                @keydown.left.prevent="toLeftColumn('hours')"
                @keydown.right.prevent="toRightColumn('hours')"
                @keydown.esc.exact="debounceBlur"
                @blur="debounceBlur"
                @focus="keepFocusing"></li>
          </template>
        </ul>
        <ul class="minutes" tabindex="-1" @scroll="keepFocusing">
          <li class="hint" v-text="minuteLabelText" tabindex="-1"></li>
          <template v-for="(m, mIndex) in minutes">
            <li v-if="!opts.hideDisabledMinutes || (opts.hideDisabledMinutes && !isDisabled('minute', m))"
                :key="mIndex"
                :class="{active: minute === m}"
                :tabindex="isDisabled('minute', m) ? -1 : tabindex"
                :data-key="m"
                :disabled="isDisabled('minute', m)"
                v-text="m"
                @click="select('minute', m)"
                @keydown.space.prevent="select('minute', m)"
                @keydown.enter.prevent="select('minute', m)"
                @keydown.up.prevent="prevItem('minutes', m)"
                @keydown.down.prevent="nextItem('minutes', m)"
                @keydown.left.prevent="toLeftColumn('minutes')"
                @keydown.right.prevent="toRightColumn('minutes')"
                @keydown.esc.exact="debounceBlur"
                @blur="debounceBlur"
                @focus="keepFocusing"></li>
          </template>
        </ul>
        <ul class="seconds" v-if="secondType" tabindex="-1" @scroll="keepFocusing">
          <li class="hint" v-text="secondLabelText" tabindex="-1"></li>
          <template v-for="(s, sIndex) in seconds">
            <li v-if="!opts.hideDisabledSeconds || (opts.hideDisabledSeconds && !isDisabled('second', s))"
                :key="sIndex"
                :class="{active: second === s}"
                :tabindex="isDisabled('second', s) ? -1 : tabindex"
                :data-key="s"
                :disabled="isDisabled('second', s)"
                v-text="s"
                @click="select('second', s)"
                @keydown.space.prevent="select('second', s)"
                @keydown.enter.prevent="select('second', s)"
                @keydown.up.prevent="prevItem('seconds', s)"
                @keydown.down.prevent="nextItem('seconds', s)"
                @keydown.left.prevent="toLeftColumn('seconds')"
                @keydown.right.prevent="toRightColumn('seconds')"
                @keydown.esc.exact="debounceBlur"
                @blur="debounceBlur"
                @focus="keepFocusing"></li>
          </template>
        </ul>
        <ul class="apms" v-if="apmType" tabindex="-1" @scroll="keepFocusing">
          <li class="hint" v-text="apmLabelText" tabindex="-1"></li>
          <template v-for="(a, aIndex) in apms">
            <li v-if="!opts.hideDisabledHours || (opts.hideDisabledHours && !isDisabled('apm', a))"
                :key="aIndex"
                :class="{active: apm === a}"
                :tabindex="isDisabled('apm', a) ? -1 : tabindex"
                :data-key="a"
                :disabled="isDisabled('apm', a)"
                v-text="apmDisplayText(a)"
                @click="select('apm', a)"
                @keydown.space.prevent="select('apm', a)"
                @keydown.enter.prevent="select('apm', a)"
                @keydown.up.prevent="prevItem('apms', a)"
                @keydown.down.prevent="nextItem('apms', a)"
                @keydown.left.prevent="toLeftColumn('apms')"
                @keydown.right.prevent="toRightColumn('apms')"
                @keydown.esc.exact="debounceBlur"
                @blur="debounceBlur"
                @focus="keepFocusing"></li>
          </template>
        </ul>
      </template><!-- / Advanced Keyboard Support -->
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

.vue__time-picker input.display-time.invalid:not(.skip-error-style) {
  border-color: #cc0033;
  outline-color: #cc0033;
}

.vue__time-picker input.display-time:disabled,
.vue__time-picker input.display-time.disabled {
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
  width: 1.3em;
  z-index: 3;
  font-size: 1.1em;
  line-height: 1em;
  vertical-align: middle;
  color: #d2d2d2;
  background: rgba(255,255,255,0);
  text-align: center;
  font-style: normal;

  /* Vertical align fixes for webkit browsers only */
  -webkit-margin-before: -0.15em;

  -webkit-transition: color .2s;
  transition: color .2s;
}

.vue__time-picker .clear-btn:hover {
  color: #797979;
  cursor: pointer;
}

.vue__time-picker .clear-btn:active {
  outline: 0;
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

.vue__time-picker .dropdown .select-list:focus,
.vue__time-picker .dropdown .select-list:active {
  outline: 0;
}

.vue__time-picker .dropdown ul {
  padding: 0;
  margin: 0;
  list-style: none;
  outline: 0;

  flex: 1 1 0.00001px;
  overflow-x: hidden;
  overflow-y: auto;
}

.vue__time-picker .dropdown ul.minutes,
.vue__time-picker .dropdown ul.seconds,
.vue__time-picker .dropdown ul.apms{
  border-left: 1px solid #fff;
}

.vue__time-picker .dropdown ul li {
  list-style: none;
  text-align: center;
  padding: 0.3em 0;
  color: #161616;
}

.vue__time-picker .dropdown ul li:not(.hint):not([disabled]):hover,
.vue__time-picker .dropdown ul li:not(.hint):not([disabled]):focus {
  background: rgba(0,0,0,.08);
  color: #161616;
  cursor: pointer;
}

.vue__time-picker .dropdown ul li:not([disabled]).active,
.vue__time-picker .dropdown ul li:not([disabled]).active:hover,
.vue__time-picker .dropdown ul li:not([disabled]).active:focus {
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
