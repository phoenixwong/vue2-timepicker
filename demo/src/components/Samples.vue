<script>
import VueTimepicker from '../../../src/vue-timepicker'
import SampleBlock from './SampleBlock'

export default {
  name: 'Samples',
  components: {
    VueTimepicker,
    SampleBlock
  },
  data () {
    return {
      yourData: {
        hh: '03',
        mm: '05',
        ss: '00',
        a: 'am'
      },
      yourFormat: 'hh:mm:ss a',
      yourDaysArray: [
        {start_time: {HH: '08', mm: '00'}, end_time: {HH: '09', mm: '00'}},
        {start_time: {HH: '15', mm: '00'}, end_time: {HH: '', mm: ''}},
        {start_time: {HH: '', mm: ''}, end_time: {HH: '13', mm: '30'}},
        {start_time: {HH: '', mm: ''}, end_time: {HH: '', mm: ''}}
      ],

      simpleStringValue: '02:30',
      yourStringValue: '3:mm:05 A',
      unsetStringValue: '',

      muteFlowListener: true,
      latestDataFlow: undefined,
      demoData1: {HH: '08', mm: '30'},
      demoData2: {HH: '10', mm: '45'},
      demoArgs: undefined,

      dropdownStatus: 'closed',
      
      focusState: 'blurred',
      dropdownState: 'closed',

      lazyData: {
        hh: '06',
        mm: '50',
        ss: '00',
        a: 'am'
      },
      lazyChangeData: undefined,
      lazyInputData: undefined,
      lazyEventTs: undefined,

      manualStringValue: '8:15 pm',

      autoScrollData1: '08:40',
      autoScrollData2: '5:30:20 pm',

      apmFirst1: 'AM 03:15',
      apmFirst2: 'pm9時6分',

      sideNav: [
        { title: 'Default', anchor: 'default' },
        { title: '12 Hours', anchor: 'format12hours' },
        { title: 'Seconds Picker', anchor: 'seconds' },
        { title: 'Customized Interval', anchor: 'interval' },
        { title: 'Using v-model', anchor: 'vModel' },
        { title: 'v-model with String Value', anchor: 'vModelWithString' },
        { title: 'Work with v-for', anchor: 'vForSample' },
        { title: 'Hour Range', anchor: 'hourRange' },
        { title: 'Minute and Second Range', anchor: 'minuteAndSecondRange' },
        { title: 'Hide Disabled Items', anchor: 'hideDisabledItems' },
        { title: 'Close on Complete', anchor: 'closeOnComplete' },
        { title: 'Hide Clear Button', anchor: 'hideClearButton' },
        { title: 'Disable Picker', anchor: 'disablePicker' },
        { title: 'The @change Event', anchor: 'onChangeSample' },
        { title: 'Lazy Event Mode', anchor: 'lazyEvents' },
        { title: 'Keyboard Support', anchor: 'kbSupport' },
        { title: 'Manual Input', anchor: 'manualInput'},
        { title: '@open and @close event', anchor: 'openAndClose' },
        { title: '@focus and @blur event', anchor: 'focusAndBlur' },
        { title: 'Customized Picker Labels', anchor: 'customPickerLabels' },
        { title: 'Adjust Input Width', anchor: 'inputWidth' },
        { title: 'Auto-Scroll', anchor: 'autoScroll' },
        { title: 'More Powerful format String', anchor: 'morePowerfulFormat' }
      ]
    }
  },

  methods: {
    changeHandler (eventData) {
      if (this.muteFlowListener) { return }
      this.latestDataFlow = eventData
      this.demoArgs = undefined
    },

    otherChangeHandler (eventData, arg1, arg2) {
      if (this.muteFlowListener) { return }
      this.latestDataFlow = eventData
      this.demoArgs = {
        arg1: arg1,
        arg2: arg2
      }
    },

    lazyChangeHandler (eventData) {
      this.lazyChangeData = eventData
      this.lazyEventTs = new Date().toLocaleString()
    },

    lazyInputHandler (eventData) {
      this.lazyInputData = eventData
    }
  },

  mounted () {
    window.setTimeout(() => {
      this.muteFlowListener = false
    }, 1000)
  }
}
</script>

<template lang="pug">
section#mostlyUsedSamples
  h2.section-title Common Usage

  //- Default
  sample-block#default
    template(v-slot:title) Default
    p(slot="description")
      | Default to 24-hour format
      code HH:mm
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      vue-timepicker

  //- 12 Hours
  sample-block#format12hours
    template(v-slot:title) 12 Hours
    p(slot="description")
      | By properly define the
      code format
      | string, you can set timepicker in form of 12 hours
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- 12-hour sampleaa 1 --&gt;
          | &lt;vue-timepicker format="hh:mm A"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- 12-hour sample 2 --&gt;
          | &lt;vue-timepicker format="h:m a"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b 12-hour sample 1
      p
        vue-timepicker(format="hh:mm A")
      b 12-hour sample 2
      p
        vue-timepicker(format="h:m a")

  //- Seconds Picker
  sample-block#seconds
    template(v-slot:title) Seconds Picker
    p(slot="description")
      | You can trigger the seconds picker by adding
      code ss
      | or
      code s
      | in your format string.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker format="HH:mm:ss"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      vue-timepicker(format="HH:mm:ss")

  //- Customized Interval
  sample-block#interval
    template(v-slot:title) Customized Interval
    p(slot="description")
      | Timepicker also allows you to display minutes or seconds picker with certain interval, like a 10-minute interval
      code 0, 10, 20, ... 50, 60
      | for example
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- 10-minute interval --&gt;
          | &lt;vue-timepicker :minute-interval="10"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- 15-second interval --&gt;
          | &lt;vue-timepicker format="HH:mm:ss" :second-interval="15"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- 5-minute interval plus 10-second interval --&gt;
          | &lt;vue-timepicker format="hh:mm:ss" :minute-interval="5" :second-interval="10"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b 10-minute interval
      p
        vue-timepicker(:minute-interval="10")
      b 15-second interval
      p
        vue-timepicker(format="HH:mm:ss" :second-interval="15")
      b 5-minute interval plus 10-second interval
      p
        vue-timepicker(format="hh:mm:ss" :minute-interval="5" :second-interval="10")

  //- Using v-model
  sample-block#vModel
    template(v-slot:title)
      | Using&nbsp;
      code v-model
    p(slot="description")
      | Timepicker takes <code>v-model</code> value in object format by default.
    template(v-slot:codes)
      highlight-code(lang="javascript" data-title="JS")
        pre
          | // Define format and initial data
          | data () {
          |   return {
          |     yourFormat: 'hh:mm:ss a',
          |     yourData: {
          |       hh: '03',
          |       mm: '05',
          |       ss: '00',
          |       a: 'am'
          |     }
          |   }
          | }
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker :format="yourFormat" v-model="yourData"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      vue-timepicker(:format="yourFormat" v-model="yourData")
    template(v-slot:data)
      highlight-code(lang="json" data-title="`yourData` in live (JSON)") {{ yourData }}

  //- String format `v-model`
  sample-block#vModelWithString
    template(v-slot:title)
      code v-model
      | &nbsp;with String Value
    p(slot="description")
      | From <code>v1.0.0+</code>, timepicker also supports <code>v-model</code> value in string format.
    template(v-slot:codes)
      highlight-code(lang="javascript" data-title="JS")
        pre
          | // Set initial data in string format
          | data () {
          |   return {
          |     simpleStringValue: '02:30',
          |
          |     // paired with format 'h:mm:ss A'
          |     yourStringValue: '3:mm:05 A',
          |
          |     unsetStringValue: ''
          |   }
          | }
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- default 24-hour sample --&gt;
          | &lt;vue-timepicker v-model="simpleStringValue"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- 12-hour format with partial value set --&gt;
          | &lt;vue-timepicker v-model="yourStringValue" format="h:mm:ss A"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- unset/unknown initial value --&gt;
          | &lt;vue-timepicker v-model="unsetStringValue"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b default 24-hour sample
      p
        vue-timepicker(v-model="simpleStringValue")
        span.inline-data-preview
          | simpleStringValue&nbsp;
          code "{{ simpleStringValue }}"
      b 12-hour format with partial value set
      p
        vue-timepicker(v-model="yourStringValue" format="h:mm:ss A")
        span.inline-data-preview
          | yourStringValue:&nbsp;
          code "{{ yourStringValue }}"
      b unset/unknown initial value
      p
        vue-timepicker(v-model="unsetStringValue")
        span.inline-data-preview
          | unsetStringValue:&nbsp;
          code "{{ unsetStringValue }}"

  //- v-for Example
  sample-block#vForSample
    template(v-slot:title)
      | Work with&nbsp;
      code v-for
    p(slot="description")
      | Here's a quick sample of
      code v-for
      | usage
    template(v-slot:codes)
      highlight-code(lang="javascript" data-title="JS")
        pre
          | data () {
          |   return {
          |     yourDaysArray: [
          |       {start_time: {HH: '08', mm: '00'}, end_time: {HH: '09', mm: '00'}},
          |       {start_time: {HH: '15', mm: '00'}, end_time: {HH: '', mm: ''}},
          |       {start_time: {HH: '', mm: ''}, end_time: {HH: '13', mm: '30'}},
          |       {start_time: {HH: '', mm: ''}, end_time: {HH: '', mm: ''}}
          |     ]
          |   }
          | }
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;p v-for="(day, index) in yourDaysArray"&gt;
          |   &lt;label&gt;Day <span>{{</span> index + 1 <span>}}</span>: &lt;/label&gt;
          |   &lt;vue-timepicker v-model="day.start_time" placeholder="Start Time"&gt;&lt;/vue-timepicker&gt;
          |   &lt;span&gt; to &lt;/span&gt;
          |   &lt;vue-timepicker v-model="day.end_time" placeholder="End Time"&gt;&lt;/vue-timepicker&gt;
          | &lt;/p&gt;
    template(v-slot:preview)
      p(v-for="(day, index) in yourDaysArray")
        label Day {{ index + 1 }}:&nbsp;
        vue-timepicker(v-model="day.start_time" placeholder="Start Time")
        span &nbsp;to&nbsp;
        vue-timepicker(v-model="day.end_time" placeholder="End Time")
    template(v-slot:data)
      highlight-code(lang="json" data-title="`yourDaysArray` JSON in live") {{ yourDaysArray }}

  //- Hour Range
  sample-block#hourRange
    template(v-slot:title) Hour Range
    p(slot="description") Define the hour values you want and disable the rest
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- Hour Range Sample 1 --&gt;
          | &lt;vue-timepicker :hour-range="[5, [8, 12], [14, 17], 19]"&gt;&lt;/vue-timepicker&gt;
          | &lt;!-- >> Equals to :hour-range="[5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 19]" --&gt;
          | &nbsp;
          | &lt;!-- Hour Range Sample 2 (12-hour format) --&gt;
          | &lt;vue-timepicker :hour-range="['7a', '9a', '11a', '1p', ['3p', '5p'], '7p']" format="hh:mm a"&gt;&lt;/vue-timepicker&gt;
          | &lt;!-- >> Equals to :hour-range="['7a', '9a', '11a', '1p', '3p', '4p', '5p', '7p']" --&gt;
    template(v-slot:preview)
      b Hour Range Sample 1
      p
        vue-timepicker(:hour-range="[5, [8, 12], [14, 17], 19]")
      b Hour Range Sample 2 (12-hour format)
      p
        vue-timepicker(:hour-range="['7a', '9a', '11a', '1p', ['3p', '5p'], '7p']" format="hh:mm a")

  //- Minute Range
  sample-block#minuteAndSecondRange
    template(v-slot:title) Minute and Second Range
    template(v-slot:description)
      p Similar to Hour Range, you can set available minute/second values base on your needs.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- Minute range only --&gt;
          | &lt;vue-timepicker :minute-range="[0, 6, [10, 30], 42, 50]"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- Minute range + 5-minute interval --&gt;
          | &lt;vue-timepicker :minute-range="[0, 6, [10, 30], 42, 50]" :minute-interval="5"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- Second range only --&gt;
          | &lt;vue-timepicker format="H:m:s" :second-range="[0, 6, [10, 30], 42, 50]"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- Second range + 10-second interval --&gt;
          | &lt;vue-timepicker format="H:m:s" :second-range="[0, 6, [10, 30], 42, 50]" :second-interval="10"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- Minute and Second ranges + 10-minute interval + 5-second interval --&gt;
          | &lt;vue-timepicker format="HH:mm:ss" :minute-range="[0, 6, [10, 30], 42, 50]" :second-range="[0, 6, [10, 30], 42, 50]" :minute-interval="10" :second-interval="5"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b Minute range only
      p
        vue-timepicker(:minute-range="[0, 6, [10, 30], 42, 50]")
      b Minute range + 5-minute interval
      p
        vue-timepicker(:minute-range="[0, 6, [10, 30], 42, 50]" :minute-interval="5")
      b Second range only
      p
        vue-timepicker(format="H:m:s" :second-range="[0, 6, [10, 30], 42, 50]")
      b Second range + 10-second interval
      p
        vue-timepicker(format="H:m:s" :second-range="[0, 6, [10, 30], 42, 50]" :second-interval="10")
      b Minute and Second ranges + 10-minute interval + 5-second interval
      p
        vue-timepicker(format="HH:mm:ss" :minute-range="[0, 6, [10, 30], 42, 50]" :second-range="[0, 6, [10, 30], 42, 50]" :minute-interval="10" :second-interval="5")

  //- Hide Disabled Items
  sample-block#hideDisabledItems
    template(v-slot:title) Hide Disabled Items
    template(v-slot:description)
      p Here're four kinds of helper properties to let you hide the values excluded by the <code>hour-range</code>, <code>minute-range</code>, and <code>second-range</code>.
      ul
        li
          b hide-disabled-items
          | : Hide <b>all</b> disabled items - hour, minute, and seconds.
        li
          b hide-disabled-hours
          | : Hide disabled <b>hour</b> valus only.
        li
          b hide-disabled-minutes
          | : Hide disabled <b>minute</b> values only.
        li
          b hide-disabled-seconds
          | : Hide disabled <b>second</b> values only.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- hide-disabled-items --&gt;
          | &lt;vue-timepicker hide-disabled-items format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- hide-disabled-hours --&gt;
          | &lt;vue-timepicker hide-disabled-hours format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- hide-disabled-minutes --&gt;
          | &lt;vue-timepicker hide-disabled-minutes format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- hide-disabled-seconds --&gt;
          | &lt;vue-timepicker hide-disabled-seconds format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b hide-disabled-items
      p
        vue-timepicker(hide-disabled-items format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]")
      b hide-disabled-hours
      p
        vue-timepicker(hide-disabled-hours format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]")
      b hide-disabled-minutes
      p
        vue-timepicker(hide-disabled-minutes format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]")
      b hide-disabled-seconds
      p
        vue-timepicker(hide-disabled-seconds format="HH:mm:ss" :hour-range="[[9, 17]]" :minute-range="[0, 10, 15, 30, 50]" :second-range="[5, 15, 25, 45]")

  //- Close on Complete
  sample-block#closeOnComplete
    template(v-slot:title) Close on Complete
    p(slot="description")
      | Automatically close the dropdown when user finish selecting <b>all</b> of the required fields.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- Auto-close on complete --&gt;
          | &lt;vue-timepicker format="hh:mm A" close-on-complete&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- Default - close by clicking anywhere outside of the dropdown --&gt;
          | &lt;vue-timepicker format="hh:mm A"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b Auto-close on complete
      p
        vue-timepicker(format="hh:mm A" close-on-complete)
      b Default - close by clicking anywhere outside of the dropdown
      p
        vue-timepicker(format="hh:mm A")

  //- Hide Clear Button
  sample-block#hideClearButton
    template(v-slot:title) Hide Clear Button
    p(slot="description")
      | If you don't want to expose the clear button in the UI,
      code hide-clear-button
      | property will do the trick.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker hide-clear-button&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      vue-timepicker(hide-clear-button)

  //- Disable Picker
  sample-block#disablePicker
    template(v-slot:title) Disable Picker
    p(slot="description")
      | Completely disable the picker.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker disabled&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      vue-timepicker(disabled)

  //- @change Sample
  sample-block#onChangeSample
    template(v-slot:title)
      | The&nbsp;
      code change
      | &nbsp;Event
    template(v-slot:description)
      p A <code>change</code> event will be triggered every time the user alters timepicker's value.
      p Unlike the <code>v-model</code>, which only returns data in your predefined format, <code>change</code> event will return a full package of all supported time tokens.
      p Started from <code>v0.2.2</code>, a <code>displayTime</code> string value is also included in the return data of <code>change</code> event.
      p Play around with the two pickers below to see their data changes in live.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- No argument --&gt;
          | &lt;vue-timepicker v-model="demoData1" @change="changeHandler"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- Custom argument --&gt;
          | &lt;vue-timepicker v-model="demoData2" @change="otherChangeHandler($event, 'foo', 42)"&gt;&lt;/vue-timepicker&gt;
      highlight-code(lang="javascript" data-title="JS")
        pre
          | methods: {
          |   // No argument
          |   changeHandler (eventData) {
          |     // eventData -&gt; {data: {HH:..., mm:...}, displayTime: 'HH:mm'}
          |   },
          |
          |   // Customized arguments
          |   otherChangeHandler (eventData, arg1, arg2) {
          |     // eventData -&gt; {data: {HH:..., mm:...}, displayTime: 'HH:mm'}
          |     // arg1 -&gt; 'foo'
          |     // arg2 -&gt; 42
          |   }
          | }
    template(v-slot:preview)
      b No argument
      p
        vue-timepicker(v-model="demoData1" @change="changeHandler")
      b With Custom arguments ('foo', 42)
      p
        vue-timepicker(v-model="demoData2" @change="otherChangeHandler($event, 'foo', 42)")
    template(v-if="latestDataFlow || demoArgs" slot="data")
      highlight-code(v-if="latestDataFlow" lang="json" data-title="The `@change` event data") {{ latestDataFlow }}
      highlight-code(v-if="demoArgs" lang="json" data-title="Received Custom Arguments") {{ demoArgs }}
      highlight-code(v-if="latestDataFlow" lang="json" data-title="`v-model` value") {{ demoArgs ? demoData2 : demoData1 }}

  //- Lazy Event Mode
  sample-block#lazyEvents
    template(v-slot:title) Lazy Event Mode
    template(v-slot:description)
      p When <code>lazy</code> event mode is toggled on, only an actual user behavior can trigger the <code>input</code> and <code>change</code> events. Which are:
      ul
        li The user opened the dropdown and picked a new value
        li The user clicked the ("x") clear button
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker lazy format="hh:mm:ss a"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      p
        vue-timepicker(v-model="lazyData" lazy format="hh:mm:ss a" @input="lazyInputHandler" @change="lazyChangeHandler")
        span.inline-data-preview(v-if="lazyEventTs")
          b Last <code>change</code> event timestamp:
          | &nbsp;{{ lazyEventTs }}

    template(v-slot:data)
      highlight-code(v-if="lazyInputData" lang="json" data-title="The lazy `input` event data") {{ lazyInputData }}
      highlight-code(v-if="lazyChangeData" lang="json" data-title="The lazy `change` event data") {{ lazyChangeData }}

  //- Keyboard Support
  sample-block#kbSupport
    template(v-slot:title) Keyboard Support
    template(v-slot:description)
      p
        b Basic Keyboard Support:
      ul
        li
          b Tab
          | : Focus or blur the Timepicker
        li
          b Esc
          | : Close the dropdown
      p
        b Advance Keyboard Support:
      ul
        li
          b Arrow Keys
          | : Navigate between valid (non-disabled) values and columns
        li
          b Space
          | &nbsp;or&nbsp;
          b Enter
          | : Select the focusing item
      p Try tabbing through the following inputs to see the difference between the <b>Default Timepicker</b> and the <b>Timepicker with Advanced Keyboard support</b>.

    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;label for="otherInput"&gt;Text Input&lt;label/&gt;
          | &lt;input id="otherInput" type="text" placeholder="Text" /&gt;
          |
          | &lt;!-- Default, with minimal keyboard support --&gt;
          | &lt;label for="simplePicker"&gt;Default Vue Timepicker&lt;label/&gt;
          | &lt;vue-timepicker id="simplePicker"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;label for="moreInput"&gt;Number Input&lt;label/&gt;
          | &lt;input id="moreInput" type="number" placeholder="Number" /&gt;
          |
          | &lt;!-- Advanced Keyboard Support Enabled --&gt;
          | &lt;label for="pickerKB"&gt;Vue Timepicker with Advanced Keyboard support&lt;label/&gt;
          | &lt;vue-timepicker advanced-keyboard format="h:mm:ss A" :hour-range="[['7a', '5p']]" id="pickerKB"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;label for="oneMoreInput"&gt;One More Text Input&lt;label/&gt;
          | &lt;input id="oneMoreInput" type="text" placeholder="More Text" /&gt;
    template(v-slot:preview)
      b
        label(for="otherInput") Text Input
      p
        input#otherInput.native-input(type="text" placeholder="Text")
      b
        label(for="simplePicker") Default Vue Timepicker
      p
        vue-timepicker(id="simplePicker")
      b
        label(for="moreInput") Number Input
      p
        input#moreInput.native-input(type="number" placeholder="Number")
      b
        label(for="pickerKB") Vue Timepicker with Advanced Keyboard support
      p
        vue-timepicker(id="pickerKB" format="h:mm:ss A" :hour-range="[['7a', '5p']]" advanced-keyboard)
      b
        label(for="oneMoreInput") One More Text Input
      p
        input#oneMoreInput.native-input(type="text" placeholder="More Text")

  //- Manual Input
  sample-block#manualInput
    template(v-slot:title) Manual Input
    p(slot="description")
      | Allow users to input values manually. Please note that the additional <code>hide-dropdown</code> option works with <code>manual-input</code> mode only.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- 24-hour format with empty init value --&gt;
          | &lt;vue-timepicker manual-input&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- 12-hour format with a predefined value --&gt;
          | &lt;vue-timepicker format="h:mm a" v-model="manualStringValue" manual-input&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- Manual input + hide dropdown --&gt;
          | &lt;vue-timepicker manual-input hide-dropdown&gt;&lt;/vue-timepicker&gt;
      highlight-code(lang="javascript" data-title="JS")
        pre
          | data () {
          |   return {
          |     manualStringValue: '8:15 pm'
          |   }
          | }
    template(v-slot:preview)
      b 24-hour format with empty init value
      p
        vue-timepicker(manual-input)
      b 12-hour format with a predefined value
      p
        vue-timepicker(format="h:mm a" v-model="manualStringValue" manual-input)
      b Manual input + hide dropdown
      p
        vue-timepicker(manual-input hide-dropdown)

  //- Open And Close Event
  sample-block#openAndClose
    template(v-slot:title)
      code open
      | &nbsp;and&nbsp;
      code close
      | &nbsp;event
    p(slot="description")
      | Help to identify the current state of the dropdown picker.
    template(v-slot:codes)
      highlight-code(lang="javascript" data-title="JS")
        pre
          | // Define a variable for logging the status
          | data () {
          |   return {
          |     dropdownStatus: 'closed'
          |   }
          | }
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;p&gt;Dropdown Status: I'm <span>{{</span>dropdownStatus<span>}}</span>!&lt;/p&gt;
          | &nbsp;
          | &lt;vue-timepicker @open="dropdownStatus = 'opened'" @close="dropdownStatus = 'closed'"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b Dropdown Status: I'm {{dropdownStatus}}!
      p
        vue-timepicker(@open="dropdownStatus = 'opened'" @close="dropdownStatus = 'closed'")

  //- Focus And Blur Event
  sample-block#focusAndBlur
    template(v-slot:title)
      code focus
      | &nbsp;and&nbsp;
      code blur
      | &nbsp;event
    p(slot="description")
      | It works with Manual Input mode. Helps to identify the focus/blur state of the Timepicker's input. Especially useful when the dropdown is force hidden by <code>hide-dropdown</code>.
    template(v-slot:codes)
      highlight-code(lang="javascript" data-title="JS")
        pre
          | data () {
          |   return {
          |     // variable for the input state
          |     focusState: 'blurred',
          |
          |     // variable for the dropdown state
          |     dropdownState: 'closed'
          |   }
          | }
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;span&gt;Focus State: <span>{{</span>focusState<span>}}</span>&lt;/span&gt;
          | &lt;span&gt;Dropdown State: <span>{{</span>dropdownState<span>}}</span>&lt;/span&gt;
          | &nbsp;
          | &lt;vue-timepicker manual-input hide-dropdown @focus="focusState = 'focused'" @blur="focusState = 'blurred'" @open="dropdownState = 'opened'" @close="dropdownState = 'closed'"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b Focus State: {{focusState}}
      span &emsp;/&emsp;
      b Dropdown State: {{ dropdownState }}
      p
        vue-timepicker(manual-input hide-dropdown @focus="focusState = 'focused'" @blur="focusState = 'blurred'" @open="dropdownState = 'opened'" @close="dropdownState = 'closed'")

  //- Custom Labels
  sample-block#customPickerLabels
    template(v-slot:title) Customized Picker Labels
    p(slot="description")
      | Define customized labels for hour, minute, second, and APM pickers.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- 24-hour format with customized hour and minute labels --&gt;
          | &lt;vue-timepicker hour-label="heure" minute-label="minute"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- 12-hour format with customized am/pm text --&gt;
          | &lt;vue-timepicker hour-label="时" minute-label="分" second-label="秒" apm-label="午" am-text="上午" pm-text="下午" format="h:mm:ss a"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b 24-hour format with customized hour and minute label
      p
        vue-timepicker(hour-label="heure" minute-label="minute")
      b 12-hour format with customized am/pm text
      p
        vue-timepicker(hour-label="时" minute-label="分" second-label="秒" apm-label="午" am-text="上午" pm-text="下午" format="h:mm:ss a")

  //- Adjust Input Width
  sample-block#inputWidth
    template(v-slot:title) Adjust Input Width
    p(slot="description")
      | Helps you to adjust both the
      code &lt;input&gt;
      | and the dropdown picker's width
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- In `px` --&gt;
          | &lt;vue-timepicker input-width="100px"&gt;&lt;/vue-timepicker&gt;
          |
          | &lt;!-- In `em` --&gt;
          | &lt;vue-timepicker input-width="12em" format="HH:mm:ss"&gt;&lt;/vue-timepicker&gt;
    template(v-slot:preview)
      b In `px`
      p
        vue-timepicker(input-width="100px")
      b In `em`
      p
        vue-timepicker(input-width="12em" format="HH:mm:ss")

  //- Auto Scroll
  sample-block#autoScroll
    template(v-slot:title) Auto-Scroll
    p(slot="description") Auto-scroll to selected value on dropdown open.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- Default format --&gt;
          | &lt;vue-timepicker auto-scroll v-model="autoScrollData1"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- 12-hour format --&gt;
          | &lt;vue-timepicker auto-scroll format="h:mm:ss a" v-model="autoScrollData2"&gt;&lt;/vue-timepicker&gt;
      highlight-code(lang="javascript" data-title="JS")
        pre
          | // Initial values
          | data () {
          |   return {
          |     autoScrollData1: '08:40',
          |     autoScrollData2: '5:30:20 pm'
          |   }
          | }
    template(v-slot:preview)
      b Default format
      p
        vue-timepicker(auto-scroll v-model="autoScrollData1")
      b 12-hour format
      p
        vue-timepicker(auto-scroll format="h:mm:ss a" v-model="autoScrollData2")

  //- More Powerful format String
  sample-block#morePowerfulFormat
    template(v-slot:title) More Powerful <code>format</code> String
    template(slot="description")
      p The <code>format</code> parameter becomes even more powerful started from <code>v1.1.2</code>.
    template(v-slot:codes)
      highlight-code(lang="html" data-title="HTML")
        pre
          | &lt;!-- Use without "hour" --&gt;
          | &lt;vue-timepicker format="mm:ss"&gt;&lt;/vue-timepicker&gt;
          | &lt;vue-timepicker format="m:s"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- Make AM/PM the first column in the dropdown --&gt;
          | &lt;vue-timepicker format="A hh:mm" v-model="apmFirst1"&gt;&lt;/vue-timepicker&gt;
          | &lt;vue-timepicker format="ah時m分" v-model="apmFirst2" am-text="午前" pm-text="午後"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- Hour + APM only --&gt;
          | &lt;vue-timepicker format="ha"&gt;&lt;/vue-timepicker&gt;
          | &lt;vue-timepicker format="hh A"&gt;&lt;/vue-timepicker&gt;
          | &nbsp;
          | &lt;!-- One slot only --&gt;
          | &lt;!-- Not recommended, though :) --&gt;
          | &lt;vue-timepicker format="h" input-width="60px"&gt;&lt;/vue-timepicker&gt;
          | &lt;vue-timepicker format="mm" input-width="60px"&gt;&lt;/vue-timepicker&gt;
          | &lt;vue-timepicker format="ss" input-width="60px"&gt;&lt;/vue-timepicker&gt;
          | &lt;vue-timepicker format="a" input-width="60px"&gt;&lt;/vue-timepicker&gt;
      highlight-code(lang="javascript" data-title="JS")
        pre
          | // Initial values
          | data () {
          |   return {
          |     apmFirst1: 'AM 03:15',
          |     // -> Equivalent to:
          |     // apmFirst1: {
          |     //   A: 'AM',
          |     //   hh: '03',
          |     //   mm: '15'
          |     // }
          |
          |     apmFirst2: 'pm9時6分'
          |     // -> Equivalent to:
          |     // apmFirst2: {
          |     //   a: 'pm',
          |     //   h: '9',
          |     //   m: '6'
          |     // }
          |   }
          | }
    template(v-slot:preview)
      b Use without "hour"
      p
        vue-timepicker(format="mm:ss")
        | &nbsp;
        vue-timepicker(format="m:s")
      b Make AM/PM the first column in the dropdown
      p
        vue-timepicker(format="A hh:mm" v-model="apmFirst1")
        | &nbsp;
        vue-timepicker(format="ah時m分" v-model="apmFirst2" am-text="午前" pm-text="午後")
      b Hour + APM only
      p
        vue-timepicker(format="ha")
        | &nbsp;
        vue-timepicker(format="hh A")
      b One slot only
      p
        vue-timepicker(format="h" input-width="60px")
        | &nbsp;
        vue-timepicker(format="mm" input-width="60px")
        | &nbsp;
        vue-timepicker(format="ss" input-width="60px")
        | &nbsp;
        vue-timepicker(format="a" input-width="60px")

  //- Footer Links
  .footer-links
    slot(name="footer-links")

  //- Side Nav
  .sidenav
    nav
      ul
        li(v-for="(nav, navIdx) in sideNav" :key="navIdx")
          a(:href="'#' + nav.anchor" v-text="nav.title")
</template>

<style lang="stylus">
@import '../assets/_variables.styl'

section#mostlyUsedSamples
  .section-title
    padding-left: 20%

  .footer-links
    padding: 5em 0 0 20%
    a
      cursor: pointer
    .title
      position: relative
      margin-bottom: 1.5em
      a.anchor
        position: absolute
        left: -1em

    .description
      margin-left: 1.5em

  .sidenav
    position: fixed
    width: 20%
    bottom: 0
    left: 0

    ul
      padding: 0 0 0.5em 1.5em
      margin: 0
      list-style: square

      li
        padding: 0.15em 0
        font-size: 0.8em
        color: alpha($body-color, 0.4)

  // Browser Native Input
  input.native-input
    box-sizing: border-box
    border: 1px solid #d2d2d2
    width: 10em
    height: 2.2em
    padding: 0.3em 0.5em
    font-size: 1em
</style>
