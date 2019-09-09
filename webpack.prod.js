const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var WebpackChunkHash = require("webpack-chunk-hash");
var rules = require("./lib/rule.js");
var webpack = require("webpack");
const chalk = require('chalk');
var path = require("path");
var rm = require("rimraf");
const ora = require('ora');

const spinner = new ora({
	text: 'start building',
	spinner: process.argv[2]
});

var webpackConfig = {
  mode: "production",
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
	alias: {
	  '@src': path.resolve(__dirname, '..', "src/"),
	  '@pages': path.resolve(__dirname, '..', 'src', "pages/"),
	  '@components': path.resolve(__dirname, '..', 'src', "components/"),
	  '@atom': path.resolve(__dirname, '..', 'src', "atom/"),
	  '@public': path.resolve(__dirname, '..', "public/"),
	},
  },
  entry: {
	app: path.resolve(__dirname, '..', 'src','index.js')
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
  ],
};

// const spinner = ora('start building');

spinner.text = 'cleaning dist folder';

rm('../dist', function(err) {
  if (!err) {
    spinner.succeed('cleaned dist folder success');

	spinner.text = 'building';
	spinner.start();

    webpack(webpackConfig, function(err, status) {
		// console.log(err, status);
      if (!err) {
		  spinner.succeed(`build dist success. the output path:${path.resolve(__dirname, '..', 'dist')}`);
      }
    })
  } else {
    spinner.fail('rm dist error');
  }
})
module.exports = webpackConfig;
