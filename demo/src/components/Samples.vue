<script>
import VueTimepicker from '../../../src/vue-timepicker.vue'

export default {
  name: 'Samples',
  components: { VueTimepicker },
  data () {
    return {
      yourData: {
        hh: '03',
        mm: '10',
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
      demoArgs: undefined
    }
  },
  methods: {
    refreshHighlightNextTick () {
      const self = this
      this.$nextTick(() => {
        self.refreshAllHighlight()
      })
    },

    refreshAllHighlight () {
      if (!this.$el) { return }
      const codeBlocks = this.$el.querySelectorAll('pre code')
      Array.prototype.forEach.call(codeBlocks, (block) => {
        window.hljs.highlightBlock(block)
      })
    },

    changeHandler (eventData) {
      if (this.muteFlowListener) { return }
      this.latestDataFlow = eventData
      this.demoArgs = undefined
      this.refreshHighlightNextTick()
    },

    otherChangeHandler (eventData, arg1, arg2) {
      if (this.muteFlowListener) { return }
      this.latestDataFlow = eventData
      this.demoArgs = {
        arg1: arg1,
        arg2: arg2
      }
      this.refreshHighlightNextTick()
    }
  },
  mounted () {
    this.refreshHighlightNextTick()
    const self = this
    window.setTimeout(() => {
      self.muteFlowListener = false
    }, 1000)

    this.$nextTick(() => {
      window.hljs.initHighlightingOnLoad()
    })
  }
}
</script>

<template>
  <section id="mostlyUsedSamples">
    <h2 class="section-title">Common Usage</h2>

    <div class="block">
      <h3 class="title"><a class="anchor" id="default">#</a>Default</h3>
      <div class="description">
        <p>Default to 24-hour format <code>HH:mm</code></p>
      </div>
      <div class="codes">
        <pre data-title="HTML"><code class="html">&lt;vue-timepicker v-model="time" /&gt;</code></pre>
      </div>
      <div class="preview">
        <vue-timepicker :value="{ HH: '01', mm: '10' }" />
      </div>
    </div>

    <div class="block">
      <h3 class="title"><a class="anchor" id="format12hours">#</a>12 Hours</h3>
      <div class="description">
        <p>By properly define the <code>format</code> string, you can set timepicker in form of 12 hours</p>
      </div>
      <div>
        <div class="codes">
<pre data-title="HTML"><code class="html">&lt;!-- 12-hour sample 1 --&gt;
&lt;vue-timepicker format="hh:mm A" /&gt;

&lt;!-- 12-hour sample 2 --&gt;
&lt;vue-timepicker format="h:m a" /&gt;
</code></pre>
        </div>
        <div class="preview">
          <b>12-hour sample 1</b>
          <p>
            <vue-timepicker :value="{ hh: '01', mm: '10', A: 'AM'}" format="hh:mm A" />
          </p>
          <b>12-hour sample 2</b>
          <p>
            <vue-timepicker :value="{ h: '1', m: '10', a: 'am'}" format="h:m a" />
          </p>
        </div>
      </div>
    </div>

    <div class="block">
      <h3 class="title"><a class="anchor" id="seconds">#</a>Seconds Picker</h3>
      <div class="description">
        <p>You can trigger the seconds picker by adding <code>ss</code> or <code>s</code> in your format string.</p>
      </div>
      <div class="codes">
        <pre data-title="HTML"><code class="html">&lt;vue-timepicker format="HH:mm:ss" /&gt;</code></pre>
      </div>
      <div class="preview">
        <vue-timepicker :value="{ HH: '10', mm: '30', ss: '15' }" format="HH:mm:ss"></vue-timepicker>
      </div>
    </div>

    <div class="block">
      <h3 class="title"><a class="anchor" id="interval">#</a>Customized Interval</h3>
      <div class="description">
        <p>Timepicker also allows you to display minutes or seconds picker with certain interval, like a 10-minute interval <code>0, 10, 20, ... 50, 60</code> for example</p>
      </div>
      <div class="codes">
<pre data-title="HTML"><code class="html">&lt;!-- 10-minute interval --&gt;
&lt;vue-timepicker :minute-interval="10" /&gt;

&lt;!-- 15-second interval --&gt;
&lt;vue-timepicker format="HH:mm:ss" :second-interval="15" /&gt;

&lt;!-- 5-minute interval plus 10-second interval --&gt;
&lt;vue-timepicker format="hh:mm:ss" :minute-interval="5" :second-interval="10" /&gt;
</code></pre>
      </div>
      <div class="preview">
        <b>10-minute interval</b>
        <p>
          <vue-timepicker :value="{ HH: '02', mm: '30' }" :minute-interval="10" />
        </p>
        <b>15-second interval</b>
        <p>
          <vue-timepicker :value="{ HH: '05', mm: '20', ss: '30' }" format="HH:mm:ss" :second-interval="15" />
        </p>
        <b>5-minute interval plus 10-second interval</b>
        <p>
          <vue-timepicker :value="{ hh: '4', mm: '20', ss: '45' }" format="hh:mm:ss" :minute-interval="5" :second-interval="10" />
        </p>
      </div>
    </div>

    <div class="block">
      <h3 class="title"><a class="anchor" id="sync">#</a>Using <code>v-model</code></h3>
      <div class="description">
        <p>Thanks to the awesome Vue2.0 feature, you can manipulate timepicker's data with <code>v-model</code> now</p>
      </div>
      <div class="codes">
<pre data-title="JS"><code class="javascript">// Define format and initial data
data: {
  yourFormat: 'hh:mm:ss a',
  yourData: {
    hh: '03',
    mm: '10',
    ss: '00',
    a: 'am'
  }
}</code></pre>
      </div>
      <div class="codes">
        <pre data-title="HTML"><code class="html">&lt;vue-timepicker :format="yourFormat" v-model="yourData" /&gt;</code></pre>
      </div>
      <div>
        <div class="preview">
          <vue-timepicker :format="yourFormat" v-model="yourData"></vue-timepicker>
        </div>
      </div>
      <div class="codes">
        <pre data-title="`yourData` in live (JSON)"><code class="json" v-text="yourData"></code></pre>
      </div>
    </div>

    <div class="block">
      <h3 class="title"><a class="anchor" id="hideClearButton">#</a>Hide Clear Button</h3>
      <div class="description">
        <p>If you don't want to expose the clear button in the UI, <code>hide-clear-button</code> property will do the trick.</p>
      </div>
      <div class="codes">
        <pre data-title="HTML"><code class="html">&lt;vue-timepicker hide-clear-button /&gt;</code></pre>
      </div>
      <div class="preview">
        <vue-timepicker :value="{ HH: '06', mm: '30' }" hide-clear-button />
      </div>
    </div>

    <div class="block">
      <h3 class="title"><a class="anchor" id="vForSample">#</a>Work with <code>v-for</code></h3>
      <div class="description">
        <p>Here's a quick sample of <code>v-for</code> usage</p>
      </div>
      <div class="codes">
<pre data-title="JS"><code class="javascript">data: {
  yourDaysArray: [
    {start_time: {HH: '08', mm: '00'}, end_time: {HH: '09', mm: '00'}},
    {start_time: {HH: '15', mm: '00'}, end_time: {HH: '', mm: ''}},
    {start_time: {HH: '', mm: ''}, end_time: {HH: '13', mm: '30'}},
    {start_time: {HH: '', mm: ''}, end_time: {HH: '', mm: ''}}
  ]
}</code></pre>
      </div>
      <div class="codes">
<pre data-title="HTML"><code class="html">
&lt;p v-for="(day, index) in yourDaysArray"&gt;
  &lt;label&gt;Day <span>{{ index + 1}}</span>: &lt;/label&gt;
  &lt;vue-timepicker v-model="yourDaysArray[index].start_time" /&gt;
  &lt;span&gt; to &lt;/span&gt;
  &lt;vue-timepicker v-model="yourDaysArray[index].end_time" /&gt;
&lt;/p&gt;
</code></pre>
      </div>
      <div class="preview">
        <p v-for="(day, index) in yourDaysArray">
          <label>Day {{ index + 1 }}: </label>
          <vue-timepicker v-model="yourDaysArray[index].start_time"></vue-timepicker>
          <span> to </span>
          <vue-timepicker v-model="yourDaysArray[index].end_time"></vue-timepicker>
        </p>
      </div>
      <div class="codes">
<pre data-title="`yourDaysArray` JSON in live"><code class="json" v-text="yourDaysArray">
</code></pre>
      </div>
    </div>

    <div class="block footer-links">
      <slot name="footer-links"></slot>
    </div>
  </section>
</template>
