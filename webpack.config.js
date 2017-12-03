'use strict';

const path = require('path')

module.exports = {
  entry: "./src/index",

  output: {
    filename: "./dist/bundle.js"
  },

  // Enable sourcemaps
  devtool: "source-map",

  resolve: {
    // Add .ts and .tsx as resolvable extensions
    extensions: [
      ".webpack.js", ".web.js", ".ts", ".tsx", ".js"
    ],

    // Resolve absolute module references from src/ as well as node_modules/
    modules: [
      path.join(__dirname, "./src"),
      "node_modules"
    ]
  },

  module: {
    rules: [
      // Process .ts and .tsx files via the TypeScript compiler
      {
        test: /\.tsx?$/,
        use: ["awesome-typescript-loader"],
        exclude: /node_modules/
      },

      // Process .css files via the CSS loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },

      // Process .less files via the LESS loader
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
        include: path.join(__dirname, 'src', 'assets', 'css')
      },

      // Re-process any output .js files via source-map-loader
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        exclude: /node_modules/,
        enforce: "pre"
      }
    ]
  }
}
