const path = require("path");
const { merge } = require("webpack-merge");

const commonConfig = {
  entry: "./src/controller.js",
  output: {
    filename: "controller.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "Controller",
  },
  devtool: "source-map",
};

const developmentConfig = {
  mode: "development",
  devServer: {
    static: ".",
    host: "127.0.0.1",
    port: 3000,
    headers: {
      "Access-Control-Allow-Origin": "http://127.0.0.1",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
};

const productionConfig = {
  mode: "production",
  
};

module.exports = (env = {}) => {
  if (env.production) {
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};
