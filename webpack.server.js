var path = require("path");
var fs = require('fs')
var {
    getRule
} = require("./lib/rule.js");
var child_process = require('child_process');

var HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const {
    CheckerPlugin
} = require('awesome-typescript-loader');

const tsLoader = process.argv.includes('ts-loader');
const modelPath = path.resolve(__dirname, '..', 'src', 'models');

let tm2 = null;

// fs.watch(modelPath, function (event, filename) {
//   if(event === 'rename') {
//     clearTimeout(tm2);
//     tm2 = setTimeout(function() {
//       // When NodeJS exits
//       process.on("exit", function () {
//         require("child_process").spawn(process.argv.shift(), process.argv, {
//             cwd: process.cwd(),
//             detached : true,
//             stdio: "inherit"
//         });
//       });
//       process.exit();
//     }, 1000);
//   } 
// });

function getModel(modelPath) {
    var models = [];

    return new Promise((resolve, reject) => {
        fs.readdir(modelPath, function(err, files) {
            if (err) {
                resolve([]);
            }
            files.filter(fileName => fileName.indexOf('d.ts') < 0).forEach(function(filename) {
                const res = filename.split(".");
                models.push(res[0]);
            });
            resolve(models);
        });
    })
}

async function renderWebpack() {
    var webpack = require("webpack");
    const models = await getModel(modelPath);
    console.log(path.resolve(__dirname, '..', "src", 'tsconfig.json'));
    var webpack = {
        stats: { 
          children: false,
          chunks: false,
          hash: false,
          warnings: false,
          builtAt: false,
          modules: false,
          timings: false,
          assets: false,
          entrypoints: false,
        },
        mode: "development",
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            alias: {
                '@src': path.resolve(__dirname, '..', "src"),
                '@layouts': path.resolve(__dirname, '..', "src", 'layouts'),
                '@pages': path.resolve(__dirname, '..', 'src', "pages"),
                '@components': path.resolve(__dirname, '..', 'src', "components"),
                '@services': path.resolve(__dirname, '..', 'src', "services"),
                '@assets': path.resolve(__dirname, "../src/assets"),
                '@atom': path.resolve(__dirname, '..', 'src', "atom"),
                '@utils': path.resolve(__dirname, '..', 'src', "utils"),
                '@models': path.resolve(__dirname, '..', 'src', "models"),
                '@public': path.resolve(__dirname, '..', "public"),
            },

            // plugins: [
            //   new TsconfigPathsPlugin({
            //     configFile: path.resolve(__dirname, '..', 'tsconfig.json'),
            //     logLevel: "info",
            //     extensions: [".ts", ".tsx"],
            //     mainFields: ["browser", "main"],
            //     // baseUrl: "/foo"
            //   })
            // ]
        },
        entry: {
            app: path.resolve(__dirname, '..', 'src', tsLoader ? 'index.tsx' : 'index.js')
        },
        output: {
            path: path.resolve(__dirname, '.', 'dist'), // 输出的路径
            filename: '[name]-[chunkhash].js',
            // publicPath: "/assets/",
            library: 'APP',
            libraryTarget: 'window',
        },
        // externals: {
        //     "react": "React",
        //     "react-dom": "ReactDOM"
        // },
        resolveLoader: {
            alias: {
                // "db-loader": path.resolve(__dirname, '.','babel-loader.js')
            }
        },
        devtool: 'source-map',
        module: {
            rules: [
                ...getRule({
                    ts: tsLoader
                }),
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },

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
                ENV_PATH: JSON.stringify(false),
                MODELS_PATH: JSON.stringify(models),
            }),
            // new CheckerPlugin(),
            new HtmlWebpackPlugin({
                chunks: ['app'], //限定entry特定的块
                excludeChunks: ['dev-helper'], //排除entry特定的块
                filename: 'index.html',
                inject: true,
                hash: true,
                mountPoint: '<div id="root"></div>',
                // value: '23',
                template: path.resolve('.', 'public', 'document.ejs') // 模板
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            port: 9000
        },
        // externals: {
        //     "react": 'react',
        //     'react-dom': 'ReactDOM'
        // }
    };
    return webpack;
}

module.exports = renderWebpack;
