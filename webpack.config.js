const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: './src/application.js',
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: 'bundle.js',
    publicPath: ''
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ThreeJS',
      filename: 'index.html',
      template: './src/index.ejs',
      files: {
        css: ['index.css']
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader',
        query: {
          compact: true,
          presets: [
            ['es2015', {modules: false}]
          ]
        }
      }
    ]
  }
};