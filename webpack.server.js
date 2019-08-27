var path = require("path");
var print = require("./lib/print.js");
var rules = require("./lib/rule.js");
var webpack = require("webpack");
print.warn(path.resolve(__dirname, '..', "src/"));

var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = {
  mode: "development",
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@src': path.resolve(__dirname, '..', "src/"),
      '@public': path.resolve(__dirname, '..', "public/"),
    },
  },
  entry: {
    app: path.resolve(__dirname, '..','index.js')
  },
  output: {
      path: path.resolve(__dirname, '.', 'dist'), // 输出的路径
      filename: '[name]-[chunkhash].js',
      // publicPath: "/assets/",
      library: 'APP',
      libraryTarget: 'window',
  },
  // resolveLoader: {
  //   alias: {
  //     "babel-loader": path.resolve('./build/babel-loader.js')
  //   }
  // },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      ...rules,
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: "html-loader"
      //     }
      //   ]
      // }
    ]
  },
  target: "web",
  plugins: [
    new webpack.DefinePlugin({
        'process.env': 'dev',
        IS_DEV: JSON.stringify(false),
    }),
    new HtmlWebpackPlugin({
       chunks: ['app'],//限定entry特定的块
       excludeChunks: ['dev-helper'], //排除entry特定的块
       filename: 'index.html',
       inject: true,
       hash: true,
       mountPoint: '<div id="root"></div>',
       // value: '23',
       template: path.resolve('.', 'public', 'index.html')  // 模板
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  }
};


module.exports = webpack;
