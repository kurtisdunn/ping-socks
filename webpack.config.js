const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html", 
  filename: "./index.html"
});

module.exports = {
  entry: './src/components/app/index.js',
  mode: 'development',
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'main.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Blank Webpack ES^ Bootstrap',
      template: 'src/index.html'
    }),
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/)
  ],
  devServer: {
    contentBase: './src',
    inline: true
  }
};