// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development", // Set to 'development' or 'production'
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
