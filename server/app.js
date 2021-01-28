const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const compiler = webpack({ 
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
}); 

const Ping = require('./utils/ping')

//TODO figure out a better way to pass IO to classes. 
// single.ping();
app.use(middleware(compiler));
require('./routes')(app);
app.use(express.static(__dirname + './../dist'));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/dist/index.html');
// });

http.listen(8080, () => {
  console.log('listening on *:8080');
});




