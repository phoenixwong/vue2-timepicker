# CHANGELOG

> The Change Log of Vue2 Timepicker `vue2-timepicker`

## v 0.2.1

### New

- New `input-class` support. The custom input class will be assigned to the `<input type="text">` within the component. ([#57](https://github.com/phoenixwong/vue2-timepicker/issues/57))
- Add support to `placeholder`, just like other regular form elements ([#55](https://github.com/phoenixwong/vue2-timepicker/issues/55))

### Improvements

Refined `@click.stop` logic ([#38](https://github.com/phoenixwong/vue2-timepicker/issues/38))

### Fixes

Fixes possible loader issue in some Webpack configs ([#68](https://github.com/phoenixwong/vue2-timepicker/issues/68), Thanks to @RaphaelJ)

## v 0.2.0

### Breaking Changes

- Upgraded to support more current **vue** (2.6.10) and **vue-cli** (3.9.0) with Webpack 4.

### New

- New `hour-range` support. Added capability to show which hours are available and disabled the rest.
- New `hide-disabled-hours`. The best companion of `hour-range`, for you to hide unwanted hours in the hour picker.
- New `disabled` parameter. To disable dropdown picker and clear button in the UI.

### Improvements

- Put `12` before `1` in the hour select for 12-hour format (`hh` and `h`). It will be more natural, especially when paired with `hour-range`.
- Support `name` parameter as regular form inputs. (Thanks to @dilipgurung)
- Emit `open` and `close` events to help tracking the dropdown toggle status. (Thanks to @tprashan)

## v 0.1.4

### Fixes

Added stop propagation `.stop` to click events

## v 0.1.3

### Improvements

Add support to `<label for="...">` (Thanks to @Reached)

```html
<!-- Sample -->
<label for="yourID">Your Label Text</label>
<vue-timepicker id="yourID"></vue-timepicker>
```

## v 0.1.2

Release the `dist` files

## v 0.1.1

The first notable release of Vue2 Timepicker
