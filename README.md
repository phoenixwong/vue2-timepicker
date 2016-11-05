# Vue2 Time Picker

A dropdown time picker (hour|minute|second) for **Vue 2.x**, with flexible time format support.

> Looking for the Vue 1.x version? Please check the [vue-timepicker](https://github.com/phoenixwong/vue-timepicker) *(Vue 1.x supported)*

## Demo

You can see the **Vue2 Timepicker** in action in the [Demo Page](https://phoenixwong.github.io/vue2-timepicker/)

## Migration

Migrating from the Vue 1.x version? Please check [MIGRATION.md](https://github.com/phoenixwong/vue2-timepicker/blob/master/MIGRATION.md) for basic guidelines.

## Dependencies

[Vue.js](http://vuejs.org/) v2.0+

## Installation

Through NPM **(Recommended)**

```bash
npm install vue2-timepicker --save
```

Bower

```bash
bower install vue2-timepicker --save
```

## Get Started

**Step 1:** Import VueTimepicker

**A**: Include the single file component **(Recommended)**

```javascript
// import
import VueTimepicker from 'vue2-timepicker'

// Or, require
var VueTimepicker = require('vue2-timepicker')

```

or, **B**: Include distribution files with `<script>` and `<style>`

```html
<script src="yourpath/vue/dist/vue.min.js"></script>
<script src="yourpath/vue2-timepicker/dist/vue2-timepicker.min.js"></script>

<link href="yourpath/vue2-timepicker/dist/vue2-timepicker.min.css" rel="stylesheet"></link>
```

**NOTE:** When using the `dist` files, a `Vue.use()` call is needed

```javascript
// Work with <script> block
Vue.use(window.VueTimepicker)

// Else
Vue.use(VueTimepicker)
```

**Step 2**: Include VueTimepicker in your component

```javascript
var yourComponent = new Vue({
  components: { VueTimepicker },
  ...
})
```

**Step 3**: Then, you can introduce the `vue-timepicker` tag anywhere you like in your component's template

```html
<vue-timepicker></vue-timepicker>
```

## Usage

### Basic Usage

```html
<!-- Default to 24-Hour format HH:mm -->
<vue-timepicker></vue-timepicker>
```

### Customized Time Format

```html
<!-- Show seconds picker -->
<vue-timepicker format="HH:mm:ss"></vue-timepicker>

<!-- 12-hour format, with AM/PM picker -->
<vue-timepicker format="hh:mm A"></vue-timepicker>

<!-- 12-hour format, with seconds picker and am/pm picker -->
<vue-timepicker format="hh:mm:ss a"></vue-timepicker>
```

VueTimepicker will recognizes the following tokens in the format string

Section    | Token | Output
---------- | ----- | ---------------
**AM/PM**  | A     | AM PM
           | a     | am pm
**Hour**   | H     | 0 1 ... 22 23
           | HH    | 00 01 ... 22 23
           | h     | 1 2 ... 11 12
           | hh    | 01 02 ... 11 12
           | k     | 1 2 ... 23 24
           | kk    | 01 02 ... 23 24
**Minute** | m     | 0 1 ... 58 59
           | mm    | 00 01 ... 58 59
**Second** | s     | 0 1 ... 58 59
           | ss    | 00 01 ... 58 59

> If not set, `format` string will be default to "HH:mm"

### Customized Picker interval

```html
<!-- Show minute picker's value in the form of 0, 5, 10, ... 55, 60 -->
<vue-timepicker :minute-interval="5"></vue-timepicker>

<!-- Show second picker's value in the form of 0, 10, 20, ... 50, 60 -->
<vue-timepicker :second-interval="10"></vue-timepicker>

<!-- Bind interval config with your own data variable -->
<vue-timepicker :minute-interval="yourMinuteInterval"></vue-timepicker>
```

**Note:** Please do remember to add the `:` or `v-bind:` sign before the interval properties

### Hide Clear Button

```html
<vue-timepicker hide-clear-button></vue-timepicker>
```

### Bind Value with `v-model`

```javascript
// e.g. If you want to assign "10:05:00" as the initial value of vue-timepicker
var yourComponent = new Vue({
  components: { VueTimepicker },
  data: function () {
    return {
      yourTimeValue: {
        HH: "10",
        mm: "05",
        ss: "00"
      },
      ...
    }
  },
  ...
})
```

```html
<!-- HTML -->
<vue-timepicker v-model="yourTimeValue" format="HH:mm:ss"></vue-timepicker>
```

### Get Time Picker's Current Value

#### **Method 1:** Read value from `v-model`

```html
<!-- In the last section, we've set the initial value (yourTimeValue) to "10:05:00" -->
<vue-timepicker v-model="yourTimeValue" format="HH:mm:ss"></vue-timepicker>
```

```javascript
// Then, open the dropdown picker and pick a new time.
// Like setting to "14:30:15" for example
// Check the value after that
console.log(this.yourTimeValue)
// outputs -> {HH: "14", mm: "30", ss: "15"}
```

#### **Method 2:** Add `@change` event handler

```html
<!-- A: No argument -->
<vue-timepicker :time-value.sync="yourTimeValue" @change="changeHandler"></vue-timepicker>

<!-- B: Custom arguments -->
<vue-timepicker :time-value.sync="yourTimeValue" @change="otherChangeHandler($event, 'foo', 'bar')"></vue-timepicker>
```

```javascript
// A: No argument
changeHandler (eventData) {
  console.log(eventData)
  // -> {data: {HH:..., mm:... }}
}

// B: Custom arguments
otherChangeHandler (eventData, yourArg1, yourArg2) {
  console.log(eventData)
  // -> {data: {HH:..., mm:... }}
  console.log(yourArg1)
  // -> 'foo'
  console.log(yourArg2)
  // -> 'bar'
}
```

Unlike `v-model`, which only returns the defined time tokens you provided in the binding variable, the `change` event will return **all** supported formats.

In the example above, when picker is set to "14:30:15" in HH:mm:ss format, `change` event will return the following data:

```javascript
// `@change` event data
{
  HH: "14",
  H: "14",
  hh: "14",
  a: "am",
  A: "AM",
  h: "14",
  kk: "14",
  k: "14",
  m: "30",
  mm: "30",
  s: "15",
  ss: "15"
}
```

Whereas the `v-model` will only return the data with defined tokens

```javascript
// Previously defined variable (`yourTimeValue` in this case) as {HH:..., mm:..., ss:...}
// Hence, the `v-model` returns:
{
  HH: "14",
  mm: "30",
  ss: "15"
}
```

## Props API

Prop                  | Type      | Required | Default Value
--------------------- | --------- | -------- | -------------
**v-model**           | _Object_  | no       | _undefined_
**format**            | _String_  | no       | "HH:mm"
**minute-interval**   | _Number_  | no       | _undefined_
**second-interval**   | _Number_  | no       | _undefined_
**hide-clear-button** | _Boolean_ | no       | false

## Contribution

Please feel free to fork and help developing.

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

For detailed explanation on how things work, checkout the [webpack guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Change Log

Detail changes for each release are documented in [CHANGELOG.md](https://github.com/phoenixwong/vue2-timepicker/blob/master/CHANGELOG.md)

## License

[MIT](http://opensource.org/licenses/MIT)
