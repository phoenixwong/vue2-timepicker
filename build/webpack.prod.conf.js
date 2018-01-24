var path = require('path')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
  entry: './src/vue-timepicker.vue',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'vue2-timepicker.js'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.output.library = 'vue2-timepicker'
  module.exports.output.libraryTarget = 'commonjs2'
}
