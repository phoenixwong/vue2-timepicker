# Contribution

Please feel free to fork and help developing.

```bash
# Install dependencies
yarn install

# Init development dependencies
yarn dev:init

# Start developing. Serve with hot reload at localhost:8080
yarn dev
```

For detailed explanation on how things work, checkout the [Vue Cli Guide](https://cli.vuejs.org/guide/).

**BREAKING CHANGES**

- Start from `^0.2.0`, we develop Demo pages with [**Yarn**](
https://yarnpkg.com/), [**Pug**](https://pugjs.org/), and [**Stylus**](http://stylus-lang.com/)
- Upgraded to **@vue/cli v4** from `^1.1.1`.

**NOTE**

If you have trouble running `yarn dev` after the _^1.1.1_ upgrade, please try the following process:

1. Remove the existing `node_modules` folder and the `yarn.lock` in this repository's **root** directory.
2. Next, remove the `node_modules` folder and the `yarn.lock` in the **/demo** directory as well.
3. Go back to the repository's root, run `yarn install`, and `yarn dev:init` again.

---

### Watchdogs

![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/phoenixwong/vue2-timepicker?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/phoenixwong/vue2-timepicker?style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/phoenixwong/vue2-timepicker?style=flat-square)
![npm](https://img.shields.io/npm/dw/vue2-timepicker?style=flat-square)
