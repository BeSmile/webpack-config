
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var path = require("path");
var fs = require('fs');

let env = process.argv.includes('production')?'production' : 'development';

// const WorkboxPlugin = require('workbox-webpack-plugin');
// const WebpackPwaManifest = require('webpack-pwa-manifest');

const distPath = path.resolve(__dirname, '..', 'dist');
const modelPath = path.resolve(__dirname, '..', 'src', 'models');

function getModel(modelPath) {
    var models = [];

    return new Promise((resolve, reject) => {
        fs.readdir(modelPath, function(err, files) {
            if (err) {
                resolve([]);
            }
            files.forEach(function(filename) {
                const res = filename.split(".");
                models.push(res[0]);
            });
            resolve(models);
        });
    })
}
const MaterialCDN = {
    'development': '//unpkg.com/@material-ui/core@4.4.0/umd/material-ui.development.js',
    'production': '//unpkg.com/@material-ui/core@latest/umd/material-ui.production.min.js'
}[env];

const externals = [
  {
    "module": "react",
    "entry": "//unpkg.com/react@16/umd/react.production.min.js",
    "global": "React"
  },
  {
    "module": "react-dom",
    "entry": "//unpkg.com/react-dom@16/umd/react-dom.production.min.js",
    "global": "ReactDOM"
  },
  {
    "module": "react-router-dom",
    "entry": "//cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.0.1/react-router-dom.min.js",
    "global": "ReactRouterDOM"
  },
  // {
  //   "module": "material-ui",
  //   "entry": MaterialCDN,
  //   "global": 'window["material-ui"]'
  // }
];
var baseWebpackConfig = async function() {
    const models = await getModel(modelPath);
    return {
        mode: "development",
        entry: {
            app: path.join(__dirname, '..', 'src', 'index.tsx')
        },
        output: {
            path: distPath, // 输出的路径
            filename: '[name]-[chunkhash].js',
            chunkFilename: "[name].[chunkhash].js",
            // publicPath: "/assets/",
            library: 'APP',
            libraryTarget: 'window',
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
            alias: {
                '@src': path.resolve(__dirname, '..', "src/"),
                '@pages': path.resolve(__dirname, '..', 'src', "pages/"),
                '@components': path.resolve(__dirname, '..', 'src', "components/"),
                '@atom': path.resolve(__dirname, '..', 'src', "atom/"),
                '@public': path.resolve(__dirname, '..', "public/"),
                '@utils': path.resolve(__dirname, '..', 'src', "utils/"),
                '@layouts': path.resolve(__dirname, '..', 'src', "layouts/"),
            },
        },
        target: "web",
        plugins: [
            // new WebpackPwaManifest({
            //     name: 'Webpack Config',
            //     short_name: 'WpConfig',
            //     description: 'Example Webpack Config',
            //     background_color: '#ffffff'
            // }),
            // new WorkboxPlugin.GenerateSW({
            //     swDest: 'sw.js',
            //     clientsClaim: true,
            //     skipWaiting: true,
            // }),

            new webpack.DefinePlugin({
                __ENV_PATH__: JSON.stringify(false),
                __MODELS_PATH__: JSON.stringify(models),
            }),
            new CheckerPlugin(),
            new HtmlWebpackPlugin({
                // chunks: ['app'], //限定entry特定的块
                // excludeChunks: ['dev-helper'], //排除entry特定的块
                filename: 'index.html',
                inject: true,
                hash: true,
                title: 'im小站',
                externals: externals,
                mountPoint: '<div id="root"></div>',
                // value: '23',
                template: path.resolve('.', 'public', 'index.html') // 模板
            }),
        ],
        module: {
            rules: [{
                    test: /\.(ts|tsx)?$/,
                    use: [{
                        loader: "ts-loader",
                        options: {
                            transpileOnly: false
                        }
                    }],
                    exclude: /node_modules/
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: 'file-loader'
                },
                {
                    test: /\.css$/i,
                    exclude: /\.lazy\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                   test: /\.less$/,
                   use: [{
                           loader: 'css-loader',
                           options: {
                               importLoaders: 1
                           }
                       },
                       {
                           loader: 'less-loader',
                           options: {
                               // noIeCompat: true
                               importLoaders: 1,
                               modules: true
                           }
                       }
                   ]
               },
               {
                   test: /\.scss$/,
                   use: [{
                           loader: 'css-loader',
                           options: {
                               importLoaders: 1
                           }
                       },
                       {
                           loader: 'sass-loader',
                           options: {
                               modules: true
                               // noIeCompat: true
                           }
                       }
                   ]
               },
            ]
        },
        externals: (function() {
            return externals.reduce((map, item)=> {
                map[`${item.module}`] = item.global
                return map;
            }, {})
        })(),
    }
}

function externalMaterialUI (_, module, callback) {
    console.log(module);
    var isMaterialUIComponent = /^@material-ui\/core\/([^/]+)$/;
    var match = isMaterialUIComponent.exec(module);
    if (match !== null) {
        var component = match[1];
        return callback(null, `window["material-ui"].${component}`);
    }
    callback();
}

module.exports = baseWebpackConfig;
