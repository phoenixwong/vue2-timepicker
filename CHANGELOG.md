# CHANGELOG

> The Change Log of Vue2 Timepicker `vue2-timepicker`

## v 1.1.6

### New

- Support appending the dropdown menu to the document body with `append-to-body`

### Improvements

- In Manual Input mode, support jumping to the next token slot with a colon (`:`) or space (` `) key.
- Return full data on `blur` and `close` events as per the `change` event.

## v 1.1.5

### New

- Support changing dropdown direction with the `drop-direction` property. It accepts three string values: `"up"`, `"auto"` and `"down"` _(default)_.
- Additional `container-id` and `drop-offset-height` as helpers for the **"auto"** drop direction. Please check the documentation for more info.

## v 1.1.4

### New

- Support customized clear button and dropdown button with the `clearButton` and `dropdownButton` **v-slot** (Thanks to @jost-s).
- Added new `icon` **v-slot** for displaying an extra input icon.
- Added new `fixed-dropdown-button` property, to make the dropdown button always visible.

## v 1.1.3

### Improvements

- Enhanced `hide-dropdown` feature -- When the dropdown is hidden by default, users can choose to open the dropdown by clicking the triangle button "&dtrif;" (Thanks to @jost-s).
- Refined `focus` and `blur` event.
- Minor fixes for the Advanced Keyboard mode.

## v 1.1.2

### New

More powerful `format` string parameter. E.g., you can hide the "hour" column by setting `format="mm:ss"`, or make AM/PM the first column by `format="A hh:ss"`, no extra CSS hacking needed. Please check the Demo page for more examples.

### Improvements

- Support `shift+tab` to navigate to the previous token slot in the Manual Input mode (Thanks to @jost-s).
- Other minor keyboard navigation enhancements for Manual Input mode

## v 1.1.1

### Improvements

Instant feedback after manual input. Plus, add a new `manual-input-timeout` property to help set up the timeout for continuous input (Thanks to @jost-s).

#### Notes for Contributors

We've upgraded to use vue-cli **v4** in this version. Please check the CONTRIBUTING.md for more info.


## v 1.1.0

### New

- Support manually input values with the `manual-input` toggle.
- Enable to hide the dropdown menu with `hide-dropdown` in Manual Input (`manual-input`) mode.
- Added conditional helper classes `is-empty`, `invalid` and `all-selected` to the `<input>` element.
- Change the `<input>` border to red color when user input is invalid. E.g., when it contains a disabled hour value. You can mute this auto-styling by adding `"skip-error-style"` to `input-class`.
- Add support to the `autocomplete` attribute.
- Emit `error` event when the input value becomes invalid.
- Emit `focus` and `blur` events to help to identify the focus/blur state. Useful when the dropdown is force hidden by `hide-dropdown`.

### Improvements

Enable seamless loop from the start or end of a column in `advanced-keyboard` mode.

## v 1.0.8

### Improvements

Keep the dropdown menu open when mouse drag on the hour/minute/second list's scrollbar handler.

## v 1.0.7

### Fixes

Fixes `placeholder` not dynamically updated issue in some cases (Thanks to @ObsidianTech).

### Improvements

Vertical alignment refined for the clear button across different browsers.

## v 1.0.6

### New

Added `auto-scroll` feature.

### Improvements

On Advanced Keyboard mode, auto-focus on the selected value (if any) in priority.

## v 1.0.5

### Fixes

Fixes the Advanced Keyboard tab navigating feature on Firefox

## v 1.0.4

### Improvements

- Adjust the default value of `blur-delay` to 300ms. (Thanks to @rjurado01).
- Added _Array_ and _Object_ types support to `input-class`.

## v 1.0.3

### New

Added `lazy` event mode. (Thanks to @VictorCazanave)

## v 1.0.2

### New

- Support customized labels for the hour, minute, second, and APM pickers (Thanks to @maritaria).
- Support setting customized text to replace the `am`/`pm` (`AM`/`PM`) string in the UI.
- Added `input-width` property to help to adjust Timepicker's width with ease.

### Improvements

Added more guiding notes for SSR usage. (Thanks to @oj-recit)

## v 1.0.1

### Fixes

Fixes the _String_ form `v-model` support on Edge and Safari

## v 1.0.0

### Breaking Changes

**⚠️ IMPORTANT:** The default **import** source in `v1.0.0+` is different from the `v0.x` versions.

From `v1.0.0+`, CSS is excluded from the main source. Please import the CSS file separately.

```javascript
// v1.0.0+
//
import VueTimepicker from 'vue2-timepicker'
// -> Imports JS file in UMD form

// CSS
import 'vue2-timepicker/dist/VueTimepicker.css'
```

Comparing to:

```javascript
// While in the v0.x versions
import VueTimepicker from 'vue2-timepicker'
// -> Imports the *.vue Single File Component together with CSS
```

Please check the [Documentation](https://github.com/phoenixwong/vue2-timepicker/blob/master/README.md#get-started) for more available import formats.

### New

- Support using _String_ value in `v-model`.
- New `minute-range` and `second-range` support. Companioned with `hide-disabled-minutes` and `hide-disabled-seconds`.
- New `hide-disabled-items` property for hiding **all** excluded items (hour, minute and seconds) at a time.
- New `close-on-complete` for automatically close the dropdown when the user finishes selecting **all** of the required fields.
- Added `advanced-keyboard` support for Arrow Keys navigation and Space/Enter key selection.
- New `tabindex` property support, which will be assigned to the `<input type="text">` within the component.
- Added `debug-mode` to help developers investigating the input -> output process.

### Fixes

Added ES "module" and other version fields in _package.json_ to resolving more loader issues. (Thanks to @Trainmaster)

### Improvements

When `hour-range` is set in a 12-hour format Timepicker, recheck the selected hour's validity after user switching "AM/PM" from the dropdown.

## v 0.2.2

### Fixes

Fixes `v-model` watcher for cases like changing the input value programmatically (non-user behavior).

### Improvements

Added `displayTime` in the return data of `change` event.

## v 0.2.1

### New

- New `input-class` support. The custom input class will be assigned to the `<input type="text">` within the component. (Thanks to @marufmax)
- Add support to `placeholder`, just like other regular form elements

### Improvements

Refined `@click.stop` logic

### Fixes

Fixes possible loader issue in some Webpack configs (Thanks to @RaphaelJ)

## v 0.2.0

### Breaking Changes

- Upgraded to support more current **vue** (2.6.10) and **vue-cli** (3.9.0) with Webpack 4.

### New

- New `hour-range` support. Added capability to show which hours are available and disabled the rest.
- New `hide-disabled-hours`. The best companion of `hour-range`, for you to hide unwanted hours in the hour picker.
- New `disabled` parameter. To disable dropdown picker and clear button in the UI.
- Emit `open` and `close` events to help tracking the dropdown toggle status. (Thanks to @tprashan)

### Improvements

- Put `12` before `1` in the hour select for 12-hour format (`hh` and `h`). It will be more natural, especially when paired with `hour-range`.
- Support `name` parameter as regular form inputs. (Thanks to @dilipgurung)

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
