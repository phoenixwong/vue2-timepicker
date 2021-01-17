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
  hideDropdown: false,
  blurDelay: 300,
  manualInputTimeout: 1000,
  dropOffsetHeight: 160
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

    dropDirection: { type: String, default: 'down' },
    dropOffsetHeight: { type: [ Number, String ] },
    containerId: { type: String },
    appendToBody: { type: Boolean, default: false },

    manualInput: { type: Boolean, default: false },
    manualInputTimeout: { type: [ Number, String ] },
    hideDropdown: { type: Boolean, default: false },
    fixedDropdownButton: { type: Boolean, default: false },

    debugMode: { type: Boolean, default: false }
  },

  data () {
    return {
      timeValue: {},

      hours: [],
      minutes: [],
      seconds: [],
      apms: [],

      isActive: false,
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
      doClearApmChecking: false,

      selectionTimer: undefined,
      kbInputTimer: undefined,
      kbInputLog: '',
      bakCurrentPos: undefined,
      forceDropOnTop: false
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

      if (this.blurDelay && +this.blurDelay > 0) {
        options.blurDelay = +this.blurDelay
      }

      if (this.manualInputTimeout && +this.manualInputTimeout > 0) {
        options.manualInputTimeout = +this.manualInputTimeout
      }

      if (this.dropOffsetHeight && +this.dropOffsetHeight > 0) {
        options.dropOffsetHeight = +this.dropOffsetHeight
      }

      return options
    },

    useStringValue () {
      return typeof this.value === 'string'
    },

    formatString () {
      return this.opts.format || DEFAULT_OPTIONS.format
    },

    inUse () {
      const typesInUse = CONFIG.BASIC_TYPES.filter(type => this.getTokenByType(type))
      // Sort types and tokens by their sequence in the "format" string
      typesInUse.sort((l, r) => {
        return this.formatString.indexOf(this.getTokenByType(l) || null) - this.formatString.indexOf(this.getTokenByType(r) || null)
      })
      const tokensInUse = typesInUse.map(type => this.getTokenByType(type))
      return {
        hour: !!this.hourType,
        minute: !!this.minuteType,
        second: !!this.secondType,
        apm: !!this.apmType,
        types: typesInUse || [],
        tokens: tokensInUse || []
      }
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
        (this.inUse.hour && !this.hour) ||
        (this.inUse.minute && !this.minute) ||
        (this.inUse.second && !this.second) ||
        (this.inUse.apm && !this.apm)
      ) {
        return false
      }
      return true
    },

    columnsSequence () {
      return this.inUse.types.map(type => type) || []
    },

    showClearBtn () {
      if (this.hideClearButton || this.disabled) {
        return false
      }
      return !this.inputIsEmpty
    },

    showDropdownBtn () {
      if (this.fixedDropdownButton) { return true }
      if (this.opts.hideDropdown && this.isActive && !this.showDropdown) {
        return true
      }
      return false
    },

    baseOn12Hours () {
      return this.hourType === 'h' || this.hourType === 'hh'
    },

    hourRangeIn24HrFormat () {
      if (!this.hourType || !this.opts.hourRange) { return false }
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
          const am12Index = list.indexOf('12a')
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
        customApmText: false
      }
      const apmEnabled = !!this.apmType

      if (apmEnabled && this.hourRangeIn24HrFormat && this.hourRangeIn24HrFormat.length) {
        const range = [].concat([], this.hourRangeIn24HrFormat)
        result.am = range.some(value => value < 12 || value === 24)
        result.pm = range.some(value => value >= 12 && value < 24)
      } else {
        result.am = apmEnabled
        result.pm = apmEnabled
      }
      if ((this.amText && this.amText.length) || (this.pmText && this.pmText.length)) {
        result.customApmText = true
      }
      return result
    },

    minuteRangeList () {
      if (!this.minuteType || !this.opts.minuteRange) { return false }
      if (!this.opts.minuteRange.length) { return [] }
      return this.renderRangeList(this.opts.minuteRange, 'minute')
    },

    secondRangeList () {
      if (!this.secondType || !this.opts.secondRange) { return false }
      if (!this.opts.secondRange.length) { return [] }
      return this.renderRangeList(this.opts.secondRange, 'second')
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
      return this.inUse.tokens.join('|')
    },

    tokenChunks () {
      if (!this.manualInput && !this.useStringValue) { return false }

      const formatString = String(this.formatString)
      const tokensRegxStr = `(${this.tokenRegexBase})+?`
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
      if (this.inUse.hour && !this.isEmptyValue(this.hourType, this.hour) && (!this.isValidValue(this.hourType, this.hour) || this.isDisabled('hour', this.hour))) {
        result.push('hour')
      }
      if (this.inUse.minute && !this.isEmptyValue(this.minuteType, this.minute) && (!this.isValidValue(this.minuteType, this.minute) || this.isDisabled('minute', this.minute) || this.notInInterval('minute', this.minute))) {
        result.push('minute')
      }
      if (this.inUse.second && !this.isEmptyValue(this.secondType, this.second) && (!this.isValidValue(this.secondType, this.second) || this.isDisabled('second', this.second) || this.notInInterval('second', this.second))) {
        result.push('second')
      }
      if (this.inUse.apm && !this.isEmptyValue(this.apmType, this.apm) && (!this.isValidValue(this.apmType, this.apm) || this.isDisabled('apm', this.apm))) {
        result.push('apm')
      }
      if (result.length) {
        return result
      }
      return []
    },

    hasInvalidInput () {
      return Boolean(this.invalidValues && this.invalidValues.length)
    },

    autoDirectionEnabled () {
      return this.dropDirection === 'auto'
    },

    dropdownDirClass () {
      if (this.autoDirectionEnabled) {
        return this.forceDropOnTop ? 'drop-up' : 'drop-down'
      }
      return this.dropDirection === 'up' ? 'drop-up' : 'drop-down'      
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
      if (toDisabled) {
        // Force close dropdown and reset status when disabled
        if (this.isActive) {
          this.isActive = false
        }
        if (this.showDropdown) {
          this.showDropdown = false
        }
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
      if (!this.isNumber(i)) { return '' }
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

    checkAcceptingType (validValues, formatString) {
      if (!validValues || !formatString || !formatString.length) { return '' }
      for (let i = 0; i < validValues.length; i++) {
        if (formatString.indexOf(validValues[i]) > -1) {
          return validValues[i]
        }
      }
      return ''
    },

    renderFormat (newFormat) {
      newFormat = newFormat || this.opts.format || DEFAULT_OPTIONS.format

      let hourType = this.checkAcceptingType(CONFIG.HOUR_TOKENS, newFormat)
      let minuteType = this.checkAcceptingType(CONFIG.MINUTE_TOKENS, newFormat)
      this.secondType = this.checkAcceptingType(CONFIG.SECOND_TOKENS, newFormat)
      this.apmType = this.checkAcceptingType(CONFIG.APM_TOKENS, newFormat)

      // Failsafe checking
      if (!hourType && !minuteType && !this.secondType && !this.apmType) {
        if (this.debugMode && this.format) {
          this.debugLog(`No valid tokens found in your defined "format" string "${this.format}". Fallback to the default "HH:mm" format.`)
        }
        hourType = 'HH'
        minuteType = 'mm'
      }
      this.hourType = hourType
      this.minuteType = minuteType

      this.hourType ? this.renderHoursList() : this.hours = []
      this.minuteType ? this.renderList('minute') : this.minutes = []
      this.secondType ? this.renderList('second') : this.seconds = []
      this.apmType ? this.renderApmList() : this.apms = []

      this.$nextTick(() => {
        this.readValues()
      })
    },

    renderHoursList () {
      const hoursCount = this.baseOn12Hours ? 12 : 24
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
      if (!this.isMinuteOrSecond(listType)) { return }

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

      CONFIG.BASIC_TYPES.forEach(type => {
        const token = this.getTokenByType(type)
        if (values.indexOf(token) > -1) {
          const sanitizedValue = this.sanitizedValue(token, timeValue[token])
          this[type] = sanitizedValue
          timeValue[token] = sanitizedValue
        } else {
          this[type] = ''
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
      const tokensRegxStr = `(${this.tokenRegexBase})+?`
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
      this.inUse.types.forEach(type => {
        timeValue[this.getTokenByType(type)] = ''
      })
      this.timeValue = timeValue
    },

    setValueFromString (parsedValue, token) {
      if (!token || !parsedValue) { return '' }
      const tokenType = this.getTokenType(token)
      if (!tokenType || !tokenType.length) { return '' }
      const stdValue = (parsedValue !== this.getTokenByType(tokenType)) ? parsedValue : ''
      this[tokenType] = stdValue
      return stdValue
    },

    fillValues (forceEmit) {
      const fullValues = {}

      const baseHour = this.hour
      const baseHourType = this.hourType

      let apmValue

      // Hour type or hour value is NOT set in the "format" string
      if (!baseHourType || !this.isNumber(baseHour)) {
        CONFIG.HOUR_TOKENS.forEach(token => fullValues[token] = '')
        apmValue = this.lowerCasedApm(this.apm || '')
        fullValues.a = apmValue
        fullValues.A = apmValue.toUpperCase()

      // Both Hour type and value are set
      } else {
        const hourValue = +baseHour
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
            case 'k':
            case 'kk':
              if (this.baseOn12Hours) {
                if (apmValue === 'pm') {
                  value = hourValue < 12 ? hourValue + 12 : hourValue
                } else if (['k', 'kk'].includes(token)) {
                  value = hourValue === 12 ? 24 : hourValue
                } else {
                  value = hourValue % 12
                }
              } else {
                if (['k', 'kk'].includes(token)) {
                  value = hourValue === 0 ? 24 : hourValue
                } else {
                  value = hourValue % 24
                }
              }
              fullValues[token] = this.formatValue(token, value)
              break
            case 'h':
            case 'hh':
              // h <-> hh
              if (this.baseOn12Hours) {
                value = hourValue
                apm = apmValue || ''
              // Read from other hour formats
              } else {
                if (hourValue > 11 && hourValue < 24) {
                  apm = 'pm'
                  value = hourValue === 12 ? 12 : hourValue % 12
                } else {
                  apm = 'am'
                  value = hourValue % 12 === 0 ? 12 : hourValue
                }
              }
              fullValues[token] = this.formatValue(token, value)
              fullValues.a = apm
              fullValues.A = apm.toUpperCase()
              break
          }
        })
      }

      fullValues.m = this.formatValue('m', this.minute)
      fullValues.mm = this.formatValue('mm', this.minute)
      fullValues.s = this.formatValue('s', this.second)
      fullValues.ss = this.formatValue('ss', this.second)

      this.fullValues = fullValues

      // On lazy mode, emit `input` and `change` events only when:
      // - The user pick a new value and then close the dropdown
      // - The user click the ("x") clear button
      if (!this.lazy || forceEmit) {
        this.emitTimeValue()
      }

      if (this.closeOnComplete && this.allValueSelected && this.showDropdown) {
        this.toggleActive()
      }
    },

    getFullData () {
      if (!this.fullValues) {
        this.fillValues()
      }
      return {
        data: JSON.parse(JSON.stringify(this.fullValues)),
        displayTime: this.inputIsEmpty ? '' : String(this.displayTime)
      }
    },

    emitTimeValue () {
      if (this.lazy && this.bakDisplayTime === this.displayTime) {
        if (this.debugMode) {
          this.debugLog('The value does not change on `lazy` mode. Skip the emitting `input` and `change` event.')
        }
        return
      }

      const fullData = this.getFullData()

      if (this.useStringValue) {
        this.$emit('input', fullData.displayTime)
      } else {
        const fullValues = fullData.data
        const tokensInUse = this.inUse.tokens || []
        const timeValue = {}
        tokensInUse.forEach((token) => {
          timeValue[token] = fullValues[token] || ''
        })
        this.$emit('input', JSON.parse(JSON.stringify(timeValue)))
      }

      this.$emit('change', fullData)
    },

    translate12hRange (value) {
      const valueT = this.match12hRange(value)
      if (+valueT[1] === 12) {
        return +valueT[1] + (valueT[2].toLowerCase() === 'p' ? 0 : 12)
      }
      return +valueT[1] + (valueT[2].toLowerCase() === 'p' ? 12 : 0)
    },

    isDisabled (type, value) {
      if (!this.isBasicType(type) || !this.inUse[type]) { return true }
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

    notInInterval (section, value) {
      if (!section || !this.isMinuteOrSecond(section)) { return }
      if (this.opts[`${section}Interval`] === 1) { return false }
      return +value % this.opts[`${section}Interval`] !== 0
    },

    renderRangeList (rawRange, section) {
      if (!rawRange || !section || !this.isMinuteOrSecond(section)) { return [] }
      const range = []
      let formatedValue
      rawRange.forEach(value => {
        if (value instanceof Array) {
          if (value.length > 2 && this.debugMode) {
            this.debugLog(`Nested array within "${section}-range" must contain no more than two items. Only the first two items of ${JSON.stringify(value)} will be taken into account.`)
          }
          const start = value[0]
          const end = value[1] || value[0]
          for (let i = +start; i <= +end; i++) {
            if (i < 0 || i > 59) { continue }
            formatedValue = this.formatValue(this.getTokenByType(section), i)
            if (!range.includes(formatedValue)) {
              range.push(formatedValue)
            }
          }
        } else {
          if (+value < 0 || +value > 59) { return }
          formatedValue = this.formatValue(this.getTokenByType(section), value)
          if (!range.includes(formatedValue)) {
            range.push(formatedValue)
          }
        }
      })
      range.sort((l, r) => { return l - r })
      // Debug Mode
      if (this.debugMode) {
        const fullList = (section === 'minute' ? this.minutes : this.seconds) || []
        const validItems = fullList.filter(item => range.includes(item))
        if (!validItems || !validItems.length) {
          if (section === 'minute') {
            this.debugLog(`The minute list is empty due to the "minute-range" config\nminute-range: ${JSON.stringify(this.minuteRange)}\nminute-interval: ${this.opts.minuteInterval}`)
          } else {
            this.debugLog(`The second list is empty due to the "second-range" config\nsecond-range: ${JSON.stringify(this.secondRange)}\nsecond-interval: ${this.opts.secondInterval}`)
          }
        }
      }
      return range
    },

    forceApmSelection () {
      if (this.manualInput) {
        // Skip this to allow users to paste a string value from the clipboard in Manual Input mode
        return
      }
      if (this.apmType && !this.apm) {
        if (this.has.am || this.has.pm) {
          this.doClearApmChecking = true
          const apmValue = this.has.am ? 'am' : 'pm'
          this.apm = this.apmType === 'A' ? apmValue.toUpperCase() : apmValue
        }
      }
    },

    emptyApmSelection () {
      if (this.doClearApmChecking && this.hour === '' && this.minute === '' && this.second === '') {
        this.apm = ''
      }
      this.doClearApmChecking = false
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

    toggleActive () {
      if (this.disabled) { return }
      this.isActive = !this.isActive

      if (this.isActive) {
        this.isFocusing = true
        if (this.manualInput) {
          this.$emit('focus')
        }
        if (!this.opts.hideDropdown) {
          this.setDropdownState(true)
        }
        // Record to check if value did change in the later phase
        if (this.lazy) {
          this.bakDisplayTime = String(this.displayTime || '')
        }
        if (this.manualInput && !this.inputIsEmpty) {
          this.$nextTick(() => {
            if (this.$refs.input && this.$refs.input.selectionStart === 0 && this.$refs.input.selectionEnd === this.displayTime.length) {
              // Select the first slot instead of the whole value string when tabbed in
              this.selectFirstSlot()
            }
          })
        }
      } else {
        if (this.showDropdown) {
          this.setDropdownState(false)
        } else if (this.manualInput) {
          this.$emit('blur', this.getFullData())
        }
        this.isFocusing = false
        if (this.lazy) {
          this.fillValues(true)
          this.bakDisplayTime = undefined
        }
      }

      if (this.restrictedHourRange && this.baseOn12Hours) {
        this.showDropdown ? this.forceApmSelection() : this.emptyApmSelection()
      }
      if (this.showDropdown) {
        this.checkForAutoScroll()
      }
    },

    setDropdownState (toShow, fromUserClick = false) {
      if (toShow) {
        if (this.appendToBody) {
          this.appendDropdownToBody()
        }
        this.keepFocusing()
        if (this.autoDirectionEnabled) {
          this.checkDropDirection()
        }
        this.showDropdown = true
        this.$emit('open') 
        if (fromUserClick) {
          if (this.fixedDropdownButton) {
            this.isActive = true
          }
          this.$emit('blur', this.getFullData())
          this.checkForAutoScroll()
        }
      } else {
        this.showDropdown = false
        this.$emit('close', this.getFullData())
        if (this.appendToBody) {
          this.removeDropdownFromBody()
        }
      }
    },

    appendDropdownToBody () {
      const dropdown = this.$refs && this.$refs.dropdown
      const body = document.getElementsByTagName('body')[0]
      if (body && dropdown) {
        window.addEventListener('scroll', this.updateDropdownPos)
        dropdown.classList.add('vue__time-picker-dropdown')
        this.updateDropdownPos()
        body.appendChild(dropdown)
      }
    },

    updateDropdownPos () {
      if (!this.appendToBody) { return }
      const dropdown = this.$refs && this.$refs.dropdown
      const body = document.getElementsByTagName('body')[0]
      if (body && dropdown) {
        const box = this.$el.getBoundingClientRect()
        if (this.dropdownDirClass === 'drop-up') {
          dropdown.style.bottom = `${window.innerHeight - box.y}px`
          dropdown.style.top = 'auto'
        } else {
          dropdown.style.top = `${box.y + box.height}px`
          dropdown.style.bottom = 'auto'
        }
        dropdown.style.left = `${box.x}px`
      }
    },

    removeDropdownFromBody () {
      const dropdown = this.$refs && this.$refs.dropdown
      const body = document.getElementsByTagName('body')[0]
      if (body && dropdown && body.contains(dropdown)) {
        body.removeChild(dropdown)
      }
      if (dropdown) {
        dropdown.classList.remove('vue__time-picker-dropdown')
        dropdown.style.top = ''
        dropdown.style.bottom = ''
        dropdown.style.left = ''
        this.$el.appendChild(dropdown)
      }
      window.removeEventListener('scroll', this.updateDropdownPos)
    },

    blurEvent () {
      if (this.manualInput && !this.opts.hideDropdown) {
        // hideDropdown's `blur` event is handled somewhere else
        this.$emit('blur', this.getFullData())
      }
    },

    select (type, value) {
      if (this.isBasicType(type) && !this.isDisabled(type, value)) {
        this[type] = value
        if (this.doClearApmChecking) {
          this.doClearApmChecking = false
        }
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
      } else if (this.advancedKeyboard) {
        // Auto-focus on selected value in the first column for advanced-keyboard
        this.$nextTick(() => {
          const firstColumn = this.inUse.types[0]
          this.scrollToSelected(firstColumn, true)
        })
      }
    },

    scrollToSelected (column, allowFallback = false) {
      if (!this.timeValue || this.inputIsEmpty) { return }
      let targetList
      if (this.appendToBody && this.$refs && this.$refs.dropdown) {
        targetList = this.$refs.dropdown.querySelectorAll(`ul.${column}s`)[0]
      } else {
        targetList = this.$el.querySelectorAll(`ul.${column}s`)[0]
      }
      let targetValue = this.activeItemInCol(column)[0]
      if (!targetValue && allowFallback) {
        // No value selected in the target column, fallback to the first found valid item
        targetValue = this.validItemsInCol(column)[0]
      }
      if (targetList && targetValue) {
        targetList.scrollTop = targetValue.offsetTop || 0
        if (this.advancedKeyboard) {
          targetValue.focus()
        }
      }
    },

    scrollToSelectedValues () {
      if (!this.timeValue || this.inputIsEmpty) { return }
      this.inUse.types.forEach(section => {
        this.scrollToSelected(section)
      })
    },

    //
    // Additional Keyboard Navigation
    //

    onFocus () {
      if (this.disabled) { return }
      if (!this.isFocusing) {
        this.isFocusing = true
      }
      if (!this.isActive) {
        this.toggleActive()
      }
    },

    escBlur () {
      if (this.disabled) { return }
      window.clearTimeout(this.debounceTimer)
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
      if (!this.disabled && !this.isFocusing && this.isActive) {
        this.toggleActive()
      }
    },

    keepFocusing () {
      if (this.disabled) { return }
      window.clearTimeout(this.debounceTimer)
      if (!this.isFocusing) {
        this.isFocusing = true
      }
    },

    onTab (column, value, evt) {
      if (this.appendToBody && evt.shiftKey) {
        const firstColumn = this.inUse.types[0]
        if (column !== firstColumn) { return }
        const firstValidValue = this.validItemsInCol(firstColumn)[0]
        // Is the first valid item in the first column
        if (firstValidValue && firstValidValue.getAttribute('data-key') === String(value)) {
          evt.preventDefault()
          // Focus back on <input>
          if (this.$refs && this.$refs.input) {
            this.$refs.input.focus()
          }
        }
      }
    },

    validItemsInCol (column) {
      const columnClass = `${column}s`
      if (this.appendToBody && this.$refs && this.$refs.dropdown) {
        return this.$refs.dropdown.querySelectorAll(`ul.${columnClass} > li:not(.hint):not([disabled])`)
      }
      return this.$el.querySelectorAll(`ul.${columnClass} > li:not(.hint):not([disabled])`)
    },

    activeItemInCol (column) {
      const columnClass = `${column}s`
      if (this.appendToBody && this.$refs && this.$refs.dropdown) {
        return this.$refs.dropdown.querySelectorAll(`ul.${columnClass} > li.active:not(.hint)`)
      }
      return this.$el.querySelectorAll(`ul.${columnClass} > li.active:not(.hint)`)
    },

    getClosestSibling (column, dataKey, getPrevious = false) {
      const siblingsInCol = this.validItemsInCol(column)
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

    prevItem (column, dataKey, isManualInput = false) {
      const targetItem = this.getClosestSibling(column, dataKey, true)
      if (targetItem) {
        return isManualInput ? targetItem : targetItem.focus()
      }
    },

    nextItem (column, dataKey, isManualInput = false) {
      const targetItem = this.getClosestSibling(column, dataKey, false)
      if (targetItem) {
        return isManualInput ? targetItem : targetItem.focus()
      }
    },

    getSideColumnName (currentColumn, toLeft = false) {
      const currentColumnIndex = this.inUse.types.indexOf(currentColumn)
      if (toLeft && currentColumnIndex <= 0) {
        if (this.debugMode) {
          this.debugLog('You\'re in the leftmost list already')
        }
        return
      } else if (!toLeft && currentColumnIndex === (this.inUse.types.length - 1)) {
        if (this.debugMode) {
          this.debugLog('You\'re in the rightmost list already')
        }
        return
      }
      return this.inUse.types[toLeft ? currentColumnIndex - 1 : currentColumnIndex + 1]
    },

    getFirstItemInSideColumn (currentColumn, toLeft = false) {
      const targetColumn = this.getSideColumnName(currentColumn, toLeft)
      if (!targetColumn) { return }
      const listItems = this.validItemsInCol(targetColumn)
      if (listItems && listItems[0]) {
        return listItems[0]
      }
    },

    getActiveItemInSideColumn (currentColumn, toLeft = false) {
      const targetColumn = this.getSideColumnName(currentColumn, toLeft)
      if (!targetColumn) { return }
      const activeItems = this.activeItemInCol(targetColumn)
      if (activeItems && activeItems[0]) {
        return activeItems[0]
      }
    },

    toLeftColumn (currentColumn) {
      const targetItem = this.getActiveItemInSideColumn(currentColumn, true) || this.getFirstItemInSideColumn(currentColumn, true)
      if (targetItem) {
        targetItem.focus()
      }
    },

    toRightColumn (currentColumn) {
      const targetItem = this.getActiveItemInSideColumn(currentColumn, false) || this.getFirstItemInSideColumn(currentColumn, false)
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
      // Colon|Space
      } else if (evt.keyCode === 186 || evt.keyCode === 32) {
        evt.preventDefault()
        this.clearKbInputLog()
        this.toNextSlot()
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
        const firstChunk = this.tokenChunksPos[0]
        const lastChunk = this.tokenChunksPos[this.tokenChunksPos.length - 1]
        if ((evt.shiftKey && currentChunk.token !== firstChunk.token) || (!evt.shiftKey && currentChunk.token !== lastChunk.token)) {
          evt.preventDefault()
          this.toLateralToken(evt.shiftKey)
        }
      } else if (this.appendToBody && this.advancedKeyboard) {
        if (evt.shiftKey) { return }
        evt.preventDefault()
        if (this.inputIsEmpty) {
          const firstColumn = this.inUse.types[0]
          const targetValue = this.validItemsInCol(firstColumn)[0]
          if (targetValue) {
            targetValue.focus()
          }
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
      if (!this.manualInput || !this.$refs || !this.$refs.input) { return }
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
      const firstSlotType = this.tokenChunksPos[0].type
      if (firstSlotType === 'hour') {
        this.getClosestHourItem()
      } else {
        this.getClosestValidItemInCol(firstSlotType, this[firstSlotType])
      }
      this.selectFirstSlot()
    },

    getClosestHourItem (currentValue, direction = 'U') {
      if (!this.validHoursList || !this.validHoursList.length) {
        if (this.debugMode) {
          this.debugLog(`No valid hour values found, please check your "hour-range" config\nhour-range: ${JSON.stringify(this.hourRange)}`)
        }
        return
      }
      if (!currentValue) {
        this.setManualHour(this.validHoursList[0])
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
    },

    getClosestValidItemInCol (column, currentValue, direction = 'U') {
      if (column === 'hour') {
        this.getClosestHourItem(currentValue, direction)
      } else {
        const nextItem = direction === 'D' ? this.prevItem(column, this[column], true) : this.nextItem(column, this[column], true)
        if (nextItem) {
          this.select(column, nextItem.getAttribute('data-key'))
        }
      }
    },

    setSanitizedValueToSection (section, inputValue) {
      if (!section || !this.getTokenByType(section)) { return }
      // NOTE: Disabled values are allowed here, followed by an 'error' event, though
      const sanitizedValue = this.sanitizedValue(this.getTokenByType(section), inputValue)
      this[section] = sanitizedValue
    },

    setManualHour (nextItem) {
      if (this.is12hRange(nextItem)) {
        const hourT = this.match12hRange(nextItem)
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

    selectFirstSlot () {
      const firstChunkPos = this.getNearestChunkByPos(0)
      this.debounceSetInputSelection(firstChunkPos)
    },

    toNextSlot () {
      if (!this.inputIsEmpty && this.tokenChunksPos && this.tokenChunksPos.length) {
        const currentChunk = this.getCurrentTokenChunk()
        if (!currentChunk) { return }
        const lastChunk = this.tokenChunksPos[this.tokenChunksPos.length - 1]
        if (currentChunk.token !== lastChunk.token) {
          this.toLateralToken(false)
        }
      }
    },

    toLateralToken (toLeft) {
      const currentChunk = this.getCurrentTokenChunk()
      if (!currentChunk) {
        this.selectFirstValidValue()
        return
      }
      const currentChunkIndex = this.tokenChunksPos.findIndex(chk => chk.token === currentChunk.token)
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

    checkDropDirection () {
      if (!this.$el) { return }
      let container
      if (this.containerId && this.containerId.length) {
        container = document.getElementById(this.containerId)
        if (!container && this.debugMode) {
          this.debugLog(`Container with id "${this.containerId}" not found. Fallback to document body.`)
        }
      }
      const el = this.$el
      let spaceDown
      if (container && container.offsetHeight) {
        // Valid container found
        spaceDown = (container.offsetTop + container.offsetHeight) - (el.offsetTop + el.offsetHeight)
      } else {
        // Fallback to document body
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
        spaceDown = docHeight - (el.offsetTop + el.offsetHeight)
      }
      this.forceDropOnTop = this.opts.dropOffsetHeight > spaceDown
    },

    //
    // Helpers
    //

    is12hRange (value) {
      return /^\d{1,2}(a|p|A|P)$/.test(value)
    },

    match12hRange (value) {
      return value.match(/^(\d{1,2})(a|p|A|P)$/)
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
      return this.inUse.types[this.inUse.tokens.indexOf(token)] || ''
    },

    getTokenByType (type) {
      return this[`${type}Type`] || ''
    },

    isMinuteOrSecond (type) {
      return ['minute', 'second'].includes(type)
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
         :class="[inputClass, {'is-empty': inputIsEmpty, 'invalid': hasInvalidInput, 'all-selected': allValueSelected, 'disabled': disabled, 'has-custom-icon': $slots && $slots.icon }]"
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
         @blur="debounceBlur(); blurEvent()"
         @mousedown="onMouseDown"
         @keydown="keyDownHandler"
         @compositionstart="onCompostionStart"
         @compositionend="onCompostionEnd"
         @paste="pasteHandler"
         @keydown.esc.exact="escBlur" />
  <div class="controls" v-if="showClearBtn || showDropdownBtn" tabindex="-1">
    <span v-if="!isActive && showClearBtn" class="clear-btn" tabindex="-1"
          :class="{'has-custom-btn': $slots && $slots.clearButton }"
          @click="clearTime">
      <slot name="clearButton"><span class="char">&times;</span></slot>
    </span>
    <span v-if="showDropdownBtn" class="dropdown-btn" tabindex="-1"
          :class="{'has-custom-btn': $slots && $slots.dropdownButton }"
          @click="setDropdownState(fixedDropdownButton ? !showDropdown : true, true)"
          @mousedown="keepFocusing">
      <slot name="dropdownButton"><span class="char">&dtrif;</span></slot>
    </span>
  </div>
  <div class="custom-icon" v-if="$slots && $slots.icon"><slot name="icon"></slot></div>
  <div class="time-picker-overlay" v-if="showDropdown" @click="toggleActive" tabindex="-1"></div>
  <div class="dropdown" ref="dropdown" v-show="showDropdown" tabindex="-1"
       :class="[dropdownDirClass]" :style="inputWidthStyle"
       @mouseup="keepFocusing" @click.stop="">
    <div class="select-list" :style="inputWidthStyle" tabindex="-1">
      <!-- Common Keyboard Support: less event listeners -->
      <template v-if="!advancedKeyboard">
        <template v-for="column in columnsSequence">
          <ul v-if="column === 'hour'" :key="column" class="hours" @scroll="keepFocusing">
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
          <ul v-if="column === 'minute'" :key="column" class="minutes" @scroll="keepFocusing">
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
          <ul v-if="column === 'second'" :key="column" class="seconds" @scroll="keepFocusing">
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
          <ul v-if="column === 'apm'" :key="column" class="apms" @scroll="keepFocusing">
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
        </template>
      </template><!-- / Common Keyboard Support -->

      <!--
        Advanced Keyboard Support
        Addeds hundreds of additional event lisenters
      -->
      <template v-if="advancedKeyboard">
        <template v-for="column in columnsSequence">
          <ul v-if="column === 'hour'" :key="column" class="hours" tabindex="-1" @scroll="keepFocusing">
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
                  @keydown.tab="onTab('hour', hr, $event)"
                  @keydown.space.prevent="select('hour', hr)"
                  @keydown.enter.prevent="select('hour', hr)"
                  @keydown.up.prevent="prevItem('hour', hr)"
                  @keydown.down.prevent="nextItem('hour', hr)"
                  @keydown.left.prevent="toLeftColumn('hour')"
                  @keydown.right.prevent="toRightColumn('hour')"
                  @keydown.esc.exact="debounceBlur"
                  @blur="debounceBlur"
                  @focus="keepFocusing"></li>
            </template>
          </ul>
          <ul v-if="column === 'minute'" :key="column" class="minutes" tabindex="-1" @scroll="keepFocusing">
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
                  @keydown.tab="onTab('minute', m, $event)"
                  @keydown.space.prevent="select('minute', m)"
                  @keydown.enter.prevent="select('minute', m)"
                  @keydown.up.prevent="prevItem('minute', m)"
                  @keydown.down.prevent="nextItem('minute', m)"
                  @keydown.left.prevent="toLeftColumn('minute')"
                  @keydown.right.prevent="toRightColumn('minute')"
                  @keydown.esc.exact="debounceBlur"
                  @blur="debounceBlur"
                  @focus="keepFocusing"></li>
            </template>
          </ul>
          <ul v-if="column === 'second'" :key="column" class="seconds" tabindex="-1" @scroll="keepFocusing">
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
                  @keydown.tab="onTab('second', s, $event)"
                  @keydown.space.prevent="select('second', s)"
                  @keydown.enter.prevent="select('second', s)"
                  @keydown.up.prevent="prevItem('second', s)"
                  @keydown.down.prevent="nextItem('second', s)"
                  @keydown.left.prevent="toLeftColumn('second')"
                  @keydown.right.prevent="toRightColumn('second')"
                  @keydown.esc.exact="debounceBlur"
                  @blur="debounceBlur"
                  @focus="keepFocusing"></li>
            </template>
          </ul>
          <ul v-if="column === 'apm'" :key="column" class="apms" tabindex="-1" @scroll="keepFocusing">
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
                  @keydown.tab="onTab('apm', a, $event)"
                  @keydown.space.prevent="select('apm', a)"
                  @keydown.enter.prevent="select('apm', a)"
                  @keydown.up.prevent="prevItem('apm', a)"
                  @keydown.down.prevent="nextItem('apm', a)"
                  @keydown.left.prevent="toLeftColumn('apm')"
                  @keydown.right.prevent="toRightColumn('apm')"
                  @keydown.esc.exact="debounceBlur"
                  @blur="debounceBlur"
                  @focus="keepFocusing"></li>
            </template>
          </ul>
        </template>
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

.vue__time-picker input.has-custom-icon {
  padding-left: 1.8em;
}

.vue__time-picker input.display-time.invalid:not(.skip-error-style) {
  border-color: #cc0033;
  outline-color: #cc0033;
}

.vue__time-picker input.display-time:disabled,
.vue__time-picker input.display-time.disabled {
  color: #d2d2d2;
}

.vue__time-picker .controls {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 3;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: stretch;

  /* Prevent browser focusing on the controls layer */
  pointer-events: none;
}

.vue__time-picker .controls > * {
  cursor: pointer;
  
  width: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  padding: 0 0.35em;

  color: #d2d2d2;
  line-height: 100%;
  font-style: normal;

  /* Resume pointer-events on children components */
  pointer-events: initial;

  transition: color .2s, opacity .2s;
}

.vue__time-picker .controls > *:hover {
  color: #797979;
}

.vue__time-picker .controls > *:focus,
.vue__time-picker .controls > *:active {
  outline: 0;
}

.vue__time-picker .controls .char {
  font-size: 1.1em;
  line-height: 100%;

  /* Vertical align fixes for webkit browsers only */
  -webkit-margin-before: -0.15em;
}

.vue__time-picker .custom-icon {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1.8em;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  /* pass down mouse events to the <input> underneath */
  pointer-events: none;
}

.vue__time-picker .custom-icon img,
.vue__time-picker .custom-icon svg,
.vue__time-picker .controls img,
.vue__time-picker .controls svg {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  border: 0;
  outline: 0;
  max-width: 1em;
  height: auto;
}

.vue__time-picker .time-picker-overlay {
  z-index: 4;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.vue__time-picker .dropdown,
.vue__time-picker-dropdown {
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

/* Dropdown class when "append-to-body" is on */
.vue__time-picker-dropdown {
  position: fixed;
  z-index: 100;
}

.vue__time-picker .dropdown.drop-up,
.vue__time-picker-dropdown.drop-up {
  top: auto;
  bottom: calc(2.2em + 1px);
}

.vue__time-picker .dropdown .select-list,
.vue__time-picker-dropdown .select-list {
  width: 10em;
  height: 10em;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: space-between;
}

.vue__time-picker .dropdown .select-list:focus,
.vue__time-picker .dropdown .select-list:active,
.vue__time-picker-dropdown .select-list:focus,
.vue__time-picker-dropdown .select-list:active {
  outline: 0;
}

.vue__time-picker .dropdown ul,
.vue__time-picker-dropdown ul {
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
.vue__time-picker .dropdown ul.apms,
.vue__time-picker-dropdown ul.minutes,
.vue__time-picker-dropdown ul.seconds,
.vue__time-picker-dropdown ul.apms {
  border-left: 1px solid #fff;
}

.vue__time-picker .dropdown ul li,
.vue__time-picker-dropdown ul li {
  list-style: none;
  text-align: center;
  padding: 0.3em 0;
  color: #161616;
}

.vue__time-picker .dropdown ul li:not(.hint):not([disabled]):hover,
.vue__time-picker .dropdown ul li:not(.hint):not([disabled]):focus,
.vue__time-picker-dropdown ul li:not(.hint):not([disabled]):hover,
.vue__time-picker-dropdown ul li:not(.hint):not([disabled]):focus  {
  background: rgba(0,0,0,.08);
  color: #161616;
  cursor: pointer;
}

.vue__time-picker .dropdown ul li:not([disabled]).active,
.vue__time-picker .dropdown ul li:not([disabled]).active:hover,
.vue__time-picker .dropdown ul li:not([disabled]).active:focus,
.vue__time-picker-dropdown ul li:not([disabled]).active,
.vue__time-picker-dropdown ul li:not([disabled]).active:hover,
.vue__time-picker-dropdown ul li:not([disabled]).active:focus {
  background: #41B883;
  color: #fff;
}

.vue__time-picker .dropdown ul li[disabled],
.vue__time-picker .dropdown ul li[disabled]:hover,
.vue__time-picker-dropdown ul li[disabled],
.vue__time-picker-dropdown ul li[disabled]:hover {
  background: transparent;
  opacity: 0.3;
  cursor: not-allowed;
}

.vue__time-picker .dropdown .hint,
.vue__time-picker-dropdown .hint {
  color: #a5a5a5;
  cursor: default;
  font-size: 0.8em;
}
</style>
