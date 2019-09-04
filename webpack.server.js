var path = require("path");
var fs = require('fs')
var print = require("./lib/print.js");
var rules = require("./lib/rule.js");
var HtmlWebpackPlugin = require("html-webpack-plugin");

const modelPath = path.resolve(__dirname, '..', 'src', 'models');

function getModel(modelPath) {
    var models = [];

    return new Promise((resolve, reject) => {
        fs.readdir(modelPath, function (err, files) {
            if (err) {
                print.warn('没有model模块，请添加！');
                resolve([]);
            } else {
                files.forEach(function(filename){
                    const res = filename.split(".");
                    models.push(res[0]);
                });
                resolve(models);
            }
        });
    })
}

async function renderWebpack() {
    var webpack = require("webpack");

    const models = await getModel(modelPath);
    // console.log(models);
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
        app: path.resolve(__dirname, '../src','index.js')
      },
      output: {
          path: path.resolve(__dirname, '.', 'dist'), // 输出的路径
          filename: '[name]-[chunkhash].js',
          // publicPath: "/assets/",
          library: 'APP',
          libraryTarget: 'window',
      },
      resolveLoader: {
        alias: {
          // "db-loader": path.resolve(__dirname, '.','babel-loader.js')
        }
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
        ]
      },
      target: "web",
      plugins: [
        new webpack.DefinePlugin({
            'process.env': 'dev',
            MODELS: JSON.stringify(models),
        }),
        new HtmlWebpackPlugin({
           chunks: ['app'],//限定entry特定的块
           excludeChunks: ['dev-helper'], //排除entry特定的块
           filename: 'index.html',
           inject: true,
           hash: true,
           mountPoint: '<div id="root"></div>',
           template: path.resolve('.', 'public', 'index.html')  // 模板
        })
      ],
      devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        // host: 'localhost',
        proxy: {
            '/airwallex': {
                changeOrigin:true,
                target: 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com',
                pathRewrite: {'^/api' : ''}
            }
        }
      }
    };
    return webpack;
}

module.exports = renderWebpack;
