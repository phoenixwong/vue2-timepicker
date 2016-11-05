# Migrating from Vue 1.x vue-timepicker

There are bunch of [notable changes in Vue2](http://vuejs.org/guide/migration.html), and quite some of the key features our original `vue-timepicker` has been relying on, got deprecated since 2.0. So here we are, a brand new version compatible with Vue 2.x.

## Crucial changes

### Use `v-model` Instead of `:time-value.sync`

The `.sync` modifier on `v-bind` has been deprecated ([source](http://vuejs.org/guide/migration.html#once-and-sync-Modifiers-on-v-bind-removed)), hence the original `:time-value.sync` binding is not going to work anymore.

However, thanks to the awesome Vue2.0 feature, which now has great support for `v-model` on custom components, you can simply replace those sync properties with `v-model`.

```html
<!-- Vue 1.x -->
<vue-timepicker :time-value.sync="yourTimeValue"></vue-timepicker>

<!-- Vue 2.x version -->
<vue-timepicker v-model="yourTimeValue"></vue-timepicker>
```

### No More `vue-timepicker-update` Event

The `$dispatch` event `vue-timepicker-update` been depending on, together with the `events` option, got removed in Vue2 either ([source 1](http://vuejs.org/guide/migration.html#dispatch-and-broadcast-replaced), [source 2](http://vuejs.org/guide/migration.html#events-option-removed)). Please switch to `@change` event handler instead -- check the [Documentation](https://github.com/phoenixwong/vue2-timepicker#method-2-add-change-event-handler) for detail example.

## Minor Changes

### Replace `$arguments` with `$event` in the `change` event handler

If you're using `change` event handler **with** custom arguments, please replace the old `$arguments` parameter with `$event`

```html
<!-- Vue 1.x -->
<vue-timepicker :time-value.sync="yourTimeValue" @change="changeHandler($arguments, 'foo', 'bar')"></vue-timepicker>

<!-- Vue 2.x version -->
<vue-timepicker :time-value.sync="yourTimeValue" @change="changeHandler($event, 'foo', 'bar')"></vue-timepicker>
```

Whereas the `change` event handler *without* custom arguments is intact.

### Get Rid of the Array Wrapper `[]` in `change` Event Data

In the example above, when reading event data from the `changeHandler` in 1.x, the data structure will be --

```javascript
// Vue 1.x
[
  {
    data: {
      HH:...,
      mm:...,
      ...
    }
  }
]
```

In the 2.x version, we can say goodbye to the `[]` wrapper --

```javascript
// Vue 2.x version
{
  data: {
    HH:...,
    mm:...,
    ...
  }
}
```

### The `change` event now returns full values

In the Vue 1.x version, if you have `time-value` in sync, `change` event will only return values from your predefined tokens. Whereas the new 2.x version will always return a full value package containing all supported tokens.

For example, if you have a binding value defined in the form of "HH:mm:ss"

```javascript
// predefined data sample
data: function () {
  return {
    yourTimeValue: {
      HH: "10",
      mm: "05",
      ss: "00"
    },
    ...
  }
}
```

When the picker is set to "14:30:15" later --

```javascript
// Vue 1.x
// - only returns predefined tokens ('HH', 'mm' and 'ss')
{
  HH: "14",
  mm: "30",
  ss: "15"
}

// Vue 2.x version
// - returns All supported tokens
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

## Miscellaneous

There will be **no** standalone ES5 script in the 2.x version.
