const path = require("path");
const glob = require('glob');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const bootStrapEntryPoints = require('./webpack.bootstrap.config');
const PurifyCSSPlugin = require('purifycss-webpack');


const isProd = process.env.NODE_ENV === "production";
const cssDev = ["style-loader", "css-loader", "sass-loader"];
const cssProd = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: ["css-loader", "sass-loader"],
    publicPath: "/dist"
});
const cssConfig = isProd ? cssProd : cssDev;

const bootStrapConfig = isProd ? bootStrapEntryPoints.prod : bootStrapEntryPoints.dev;

module.exports = {
  entry: {
    app: "./src/app.js",
    contact: "./src/contact.js",
    bootstrap: bootStrapConfig
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
            test: /\.scss$/,
            use: cssConfig
      },
      {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
      },
      {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: 'file-loader?name=[name].[ext]&outputPath=images/'
      },
      {
            test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
      },
      {
            test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
            test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery'
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack boilerplate",
      // minify: {
      //     collapseWhitespace: true
      // },
      hash: true,
      //filename: './../index.html',
      excludeChunks: ["contact"],
      template: "./src/index.html"
    }),
    new HtmlWebpackPlugin({
      title: "Contact page",
      hash: true,
      chunks: ["contact"],
      filename: "contact.html",
      template: "./src/contact.html"
    }),
    new ExtractTextPlugin({
      filename: "css/[name].css",
      disable: !isProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    })
  ]
};
