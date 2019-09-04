var path = require("path");
var rm = require("rimraf");
var print = require("./lib/print.js");
var rules = require("./lib/rule.js");
var webpack = require("webpack");
const Ora = require('ora');
const chalk = require('chalk');

const spinner = new Ora({
	text: 'Loading unicorns',
	spinner: process.argv[2]
});

var WebpackChunkHash = require("webpack-chunk-hash");

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

print.warn(path.resolve(__dirname, '..', "src/"));
console.log(process.env.NODE_ENV);
var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpackConfig = {
  mode: "production",
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
      path: path.resolve(__dirname, '..', 'dist'), // 输出的路径
      filename: '[name]-[chunkhash].js',
      // publicPath: "/assets/",
      library: 'APP',
      libraryTarget: 'window',
  },

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
  optimization: {
     minimizer: [
        new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: false
                },
                compress: {
                    // warnings: false, // 去除warning警告
                    dead_code: true, // 去除不可达代码
                    pure_funcs: ['console.log'], // 配置发布时，不被打包的函数
                    drop_debugger: true, // 发布时去除debugger
                }
            }
        }),
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': 'prod',
        IS_DEV: JSON.stringify(false),
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    // new ChunkManifestPlugin({
    //   filename: "chunk-manifest.json",
    //   manifestVariable: "webpackManifest"
    // }),
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
  ]
};

rm('../dist', function(err) {
  if (!err) {
    print.success("rm dist success");
    webpack(webpackConfig, function(err, status) {
      if (!err) {
        print.success("build success")
      }
    })
  } else {
    print.error('build failed', err)
  }
})
// module.exports = webpackConfig;
