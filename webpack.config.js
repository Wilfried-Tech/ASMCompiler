//const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  entry: {
    webasm: './src/index.js'
  },
  devtool: 'inline-source-map',
  plugins: [
     new HtmlWebpackPlugin({
      title: 'Development',
      filename: '../index.html',
      template: 'template/index.html'
    }),
   ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  /*
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
      client: {
        progress: true,
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },*/
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        },
      /*
            {
              test: /\.js$/,
              use: 'babel-loader',
              exclude: /node_modules/
              }
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env',{targets:"defaults"}]
          }
        }
        }*/
      ]
  }
};

module.exports = config;