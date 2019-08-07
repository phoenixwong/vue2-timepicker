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
      muteFlowListener: true,
      latestDataFlow: undefined,
      demoData1: {HH: '08', mm: '30'},
      demoData2: {HH: '10', mm: '45'},
      demoArgs: undefined,

      sideNav: [
        { title: 'Default', anchor: 'default' },
        { title: '12 Hours', anchor: 'format12hours' },
        { title: 'Seconds Picker', anchor: 'seconds' },
        { title: 'Customized Interval', anchor: 'interval' },
        { title: 'Using v-model', anchor: 'vModel' },
        { title: 'Hide Clear Button', anchor: 'hideClearButton' },
        { title: 'Work with v-for', anchor: 'vForSample' },
        { title: 'The change Event', anchor: 'onChangeSample' },
        { title: 'Hour Range', anchor: 'hourRange' },
        { title: 'Hide Disabled Hours', anchor: 'hideDisabledHours' },
        { title: 'Disable Picker', anchor: 'disablePicker' }
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
    template(slot="title") Default
    p(slot="description")
      | Default to 24-hour format
      code HH:mm
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      vue-timepicker

  //- 12 Hours
  sample-block#format12hours
    template(slot="title") 12 Hours
    p(slot="description")
      | By properly define the
      code format
      | string, you can set timepicker in form of 12 hours
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;!-- 12-hour sample 1 --&gt;
        | &lt;vue-timepicker format="hh:mm A"&gt;&lt;/vue-timepicker&gt;
        | &nbsp;
        | &lt;!-- 12-hour sample 2 --&gt;
        | &lt;vue-timepicker format="h:m a"&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      b 12-hour sample 1
      p
        vue-timepicker(format="hh:mm A")
      b 12-hour sample 2
      p
        vue-timepicker(format="h:m a")

  //- Seconds Picker
  sample-block#seconds
    template(slot="title") Seconds Picker
    p(slot="description")
      | You can trigger the seconds picker by adding
      code ss
      | or
      code s
      | in your format string.
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker format="HH:mm:ss"&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      vue-timepicker(format="HH:mm:ss")

  //- Customized Interval
  sample-block#interval
    template(slot="title") Customized Interval
    p(slot="description")
      | Timepicker also allows you to display minutes or seconds picker with certain interval, like a 10-minute interval
      code 0, 10, 20, ... 50, 60
      | for example
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;!-- 10-minute interval --&gt;
        | &lt;vue-timepicker :minute-interval="10"&gt;&lt;/vue-timepicker&gt;
        | &nbsp;
        | &lt;!-- 15-second interval --&gt;
        | &lt;vue-timepicker format="HH:mm:ss" :second-interval="15"&gt;&lt;/vue-timepicker&gt;
        | &nbsp;
        | &lt;!-- 5-minute interval plus 10-second interval --&gt;
        | &lt;vue-timepicker format="hh:mm:ss" :minute-interval="5" :second-interval="10"&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      b 10-minute interval
      p
        vue-timepicker(:minute-interval="10")
      b 15-second interval
      p
        vue-timepicker(format="HH:mm:ss" :second-interval="15")
      b 5-minute interval plus 10-second interval
      p
        vue-timepicker( format="hh:mm:ss" :minute-interval="5" :second-interval="10")

  //- Using v-model
  sample-block#vModel
    template(slot="title")
      | Using&nbsp;
      code v-model
    p(slot="description")
      | Thanks to the awesome Vue2.0 feature, you can manipulate timepicker's data with
      code v-model
      | now
    template(slot="codes")
      highlight-code(lang="javascript" data-title="JS")
        | // Define format and initial data
        | data () {
        |   return {
        |     yourFormat: 'hh:mm:ss a',
        |     yourData: {
        |       hh: '03',
        |       mm: '10',
        |       ss: '00',
        |       a: 'am'
        |     }
        |   }
        | }
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker :format="yourFormat" v-model="yourData"&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      vue-timepicker(:format="yourFormat" v-model="yourData")
    template(slot="data")
      highlight-code(lang="json" data-title="`yourData` in live (JSON)") {{ yourData }}

  //- Hide Clear Button
  sample-block#hideClearButton
    template(slot="title") Hide Clear Button
    p(slot="description")
      | If you don't want to expose the clear button in the UI,
      code hide-clear-button
      | property will do the trick.
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker hide-clear-button&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      vue-timepicker(hide-clear-button)

  //- v-for Example
  sample-block#vForSample
    template(slot="title")
      | Work with&nbsp;
      code v-for
    p(slot="description")
      | Here's a quick sample of
      code v-for
      | usage
    template(slot="codes")
      highlight-code(lang="javascript" data-title="JS")
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
        | &lt;p v-for="(day, index) in yourDaysArray"&gt;
        |   &lt;label&gt;Day <span>{{</span> index + 1 <span>}}</span>: &lt;/label&gt;
        |   &lt;vue-timepicker v-model="day.start_time"&gt;&lt;/vue-timepicker&gt;
        |   &lt;span&gt; to &lt;/span&gt;
        |   &lt;vue-timepicker v-model="day.end_time"&gt;&lt;/vue-timepicker&gt;
        | &lt;/p&gt;
    template(slot="preview")
      p(v-for="(day, index) in yourDaysArray")
        label Day {{ index + 1 }}:&nbsp;
        vue-timepicker(v-model="day.start_time")
        span &nbsp;to&nbsp;
        vue-timepicker(v-model="day.end_time")
    template(slot="data")
      highlight-code(lang="json" data-title="`yourDaysArray` JSON in live") {{ yourDaysArray }}

  //- @change Sample
  sample-block#onChangeSample
    template(slot="title")
      | The&nbsp;
      code change
      | Event
    template(slot="description")
      p A <code>change</code> event will be triggered every time user alters the timepicker's value.
      p Unlike the <code>v-model</code>, which only returns data in your predefined format, <code>@change</code> event will return a full package of all supported time tokens.
      p Play around with the two pickers below to see their data changes in live.
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;!-- No argument --&gt;
        | &lt;vue-timepicker v-model="demoData1" @change="changeHandler"&gt;&lt;/vue-timepicker&gt;
        | &nbsp;
        | &lt;!-- Custom argument --&gt;
        | &lt;vue-timepicker v-model="demoData2" @change="otherChangeHandler($event, 'foo', 42)"&gt;&lt;/vue-timepicker&gt;
      highlight-code(lang="javascript" data-title="JS")
        | methods: {
        |   // No argument
        |   changeHandler (eventData) {
        |     // eventData -&gt; {data: {HH:..., mm:...}}
        |   },
        |
        |   // Customized arguments
        |   otherChangeHandler (eventData, arg1, arg2) {
        |     // eventData -&gt; {data: {HH:..., mm:...}}
        |     // arg1 -&gt; 'foo'
        |     // arg2 -&gt; 42
        |   }
        | }
    template(slot="preview")
      b No argument
      p
        vue-timepicker(v-model="demoData1" @change="changeHandler")
      b With Custom arguments ('foo', 42)
      p
        vue-timepicker(v-model="demoData2" @change="otherChangeHandler($event, 'foo', 42)")
    template(v-if="latestDataFlow || demoArgs" slot="data")
      highlight-code(v-if="latestDataFlow" lang="json" data-title="The `@change` eventData") {{ latestDataFlow }}
      highlight-code(v-if="demoArgs" lang="json" data-title="Received Custom Arguments") {{ demoArgs }}
      highlight-code(v-if="latestDataFlow" lang="json" data-title="`v-model` value") {{ demoArgs ? demoData2 : demoData1 }}

  //- Hour Range
  sample-block#hourRange
    template(slot="title") Hour Range
    p(slot="description") To define hour values you want and disable the rest
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;!-- Hour Range Sample 1 --&gt;
        | &lt;vue-timepicker :hour-range="[5, [8, 12], [14, 17], 19]"&gt;&lt;/vue-timepicker&gt;
        | &nbsp;
        | &lt;!-- Hour Range Sample 2 (12-hour format) --&gt;
        | &lt;vue-timepicker :hour-range="['7a', '9a', '11a', '1p', ['3p', '5p'], '7p']" format="hh:mm a"&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      b Hour Range Sample 1
      p
        vue-timepicker(:hour-range="[5, [8, 12], [14, 17], 19]")
      b Hour Range Sample 2 (12-hour format)
      p
        vue-timepicker(:hour-range="['7a', '9a', '11a', '1p', ['3p', '5p'], '7p']" format="hh:mm a")

  //- Hide Disabled Hours
  sample-block#hideDisabledHours
    template(slot="title") Hide Disabled Hours
    p(slot="description")
      | Paired with
      code hour-range
      | , help hiding those disabled values
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;!-- Hour Range Sample 1 with `hide-disabled-hours` --&gt;
        | &lt;vue-timepicker hide-disabled-hours :hour-range="[5, [8, 12], [14, 17], 19]"&gt;&lt;/vue-timepicker&gt;
        | &nbsp;
        | &lt;!-- Hour Range Sample 2 (12-hour format) with `hide-disabled-hours` --&gt;
        | &lt;vue-timepicker hide-disabled-hours :hour-range="['7a', '9a', '11a', '1p', ['3p', '5p'], '7p']" format="hh:mm a"&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      b Hour Range Sample 1 with `hide-disabled-hours`
      p
        vue-timepicker(:hour-range="[5, [8, 12], [14, 17], 19]" hide-disabled-hours)
      b Hour Range Sample 2 (12-hour format) with `hide-disabled-hours`
      p
        vue-timepicker(:hour-range="['7a', '9a', '11a', '1p', ['3p', '5p'], '7p']" format="hh:mm a" hide-disabled-hours)

  //- Disable Picker
  sample-block#disablePicker
    template(slot="title") Disable Picker
    p(slot="description")
      | Completely disable the picker.
    template(slot="codes")
      highlight-code(lang="html" data-title="HTML")
        | &lt;vue-timepicker disabled&gt;&lt;/vue-timepicker&gt;
    template(slot="preview")
      vue-timepicker(disabled)

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
        font-size: 0.85em
        color: alpha($body-color, 0.4)
</style>
