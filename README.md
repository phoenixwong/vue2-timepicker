# Vue2 Time Picker

A dropdown time picker (hour|minute|second) for **Vue 2.x**, with flexible time format support.

## Demo

You can see the **Vue2 Timepicker** in action in the [Demo Page](https://phoenixwong.github.io/vue2-timepicker/)

## Migration

Migrating from the Vue 1.x version? Please check [MIGRATION.md](https://github.com/phoenixwong/vue2-timepicker/blob/master/MIGRATION.md) for basic guidelines.

## Dependencies

[Vue.js](http://vuejs.org/) v2.6.5+

## Installation

Through YARN or NPM **(Recommended)**

```bash
yarn add vue2-timepicker
```

```bash
npm install vue2-timepicker --save
```

Bower

```bash
bower install vue2-timepicker --save
```

## Get Started

**Step 1:** Import VueTimepicker

```javascript
// JS
import VueTimepicker from 'vue2-timepicker'

// CSS
import 'vue2-timepicker/dist/VueTimepicker.css'
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
&nbsp;     | a     | am pm
**Hour**   | H     | 0 1 ... 22 23
&nbsp;     | HH    | 00 01 ... 22 23
&nbsp;     | h     | 1 2 ... 11 12
&nbsp;     | hh    | 01 02 ... 11 12
&nbsp;     | k     | 1 2 ... 23 24
&nbsp;     | kk    | 01 02 ... 23 24
**Minute** | m     | 0 1 ... 58 59
&nbsp;     | mm    | 00 01 ... 58 59
**Second** | s     | 0 1 ... 58 59
&nbsp;     | ss    | 00 01 ... 58 59

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

### Define Hour Range

Sometime you may want to limit hours picker to a specific range. The `hour-range` parameter is here to help.

```html
<vue-timepicker :hour-range="[5, [8, 12], [14, 17], 19]"></vue-timepicker>
```

Valid (selectable) hours in this example are: 5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 19

### Hide Disabled Hour Ranges

```html
<vue-timepicker :hour-range="[5, [8, 12], [14, 17], 19]" hide-disabled-hours></vue-timepicker>
```

Paired with the above `hour-range` parameter. In this sample, the hour picker will hide the invalid hours (0, 1, 2, 3, 4, 6, 7, 13, 18, 20, 21, 22, 23) and display the valid hours (5, 8, 9, ...) only.

### Disable Picker

```html
<vue-timepicker disabled></vue-timepicker>
```

Used to disable dropdown picker and clear button in the UI. To prevent users from changing values again.

## Props API

Prop                    | Type      | Required | Default Value
----------------------- | --------- | -------- | -------------
**v-model**             | _Object_  | no       | _undefined_
**format**              | _String_  | no       | "HH:mm"
**minute-interval**     | _Number_  | no       | _undefined_
**second-interval**     | _Number_  | no       | _undefined_
**hide-clear-button**   | _Boolean_ | no       | false
**hour-range**          | _Array_   | no       | _undefined_
**hide-disabled-hours** | _Boolean_ | no       | false
**disabled**            | _Boolean_ | no       | false

## Contribution

Please feel free to fork and help developing.

```bash
# Install dependencies
yarn install

# Init development dependencies
yarn dev:init

# Start developing. Serve with hot reload at localhost:8080
yarn serve
```

For detailed explanation on how things work, checkout the [Vue Cli Guide](https://cli.vuejs.org/guide/).

## Change Log

Detail changes for each release are documented in [CHANGELOG.md](https://github.com/phoenixwong/vue2-timepicker/blob/master/CHANGELOG.md)

## License

[MIT](http://opensource.org/licenses/MIT)
