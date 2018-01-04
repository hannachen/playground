import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

// Env specific plugins and options
const env = process.env.NODE_ENV
const extractSass = new ExtractTextPlugin({
  filename: "[name].bundle.css",
  disable: env === "development",
})
const prodPlugins = env === "production" ? [
  new webpack.optimize.UglifyJsPlugin()
] : []

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules']
  },
  module: {
    rules: [
      {
        // Check for all js files
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            "presets": [
              ["env", {
                "targets": {
                  "browsers": ["last 2 versions", "safari >= 7"]
                }
              }]
            ],
            'plugins': [
              'transform-class-properties',
              'transform-object-rest-spread',
              'transform-async-to-generator',
              'transform-async-generator-functions'
            ]
          }
        }]
      },
      // CSS: sass, scss
      {
        test: /\.(sass|scss)$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
            query: {
              minimize: (env === 'production'),
              sourceMap: true,
              importLoaders: true
            }
          }, {
            loader: 'resolve-url-loader'
          }, {
            loader: 'sass-loader',
            query: {
              sourceMap: true,
              sourceMapContents: true,
            }
          }],
          // use style-loader in development
          fallback: "style-loader",
        }),
      },
      // SVG
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "svg-inline-loader",
          }
        ]
      },
      // HTML: htm, html
      {
        test: /\.html?$/,
        use: "html-loader"
      },
      // Font files: eot, svg, ttf, woff, woff2
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: '',
          }
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: 2,
    }),
    extractSass,
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      hash: true,
      title: "Hanna's Playground"
    }),
    ...prodPlugins
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    open: false,
    overlay: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 9000
  }
}