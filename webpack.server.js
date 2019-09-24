var path = require("path");
var fs = require('fs')
var { getRule } = require("./lib/rule.js");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const { CheckerPlugin } = require('awesome-typescript-loader');

const tsLoader = process.argv.includes('ts-loader');

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
async function renderWebpack() {
    var webpack = require("webpack");

    const models = await getModel(modelPath);
    var webpack = {
        mode: "development",
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
        entry: {
            app: path.resolve(__dirname, '..', 'src', tsLoader?'index.tsx':'index.js')
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
                    ts: tsLoader,
                }),
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
                'process.env': {

                },
                __ENV_PATH__: JSON.stringify(false),
                __MODELS_PATH__: JSON.stringify(models),
            }),
            // new CheckerPlugin(),
            new HtmlWebpackPlugin({
                chunks: ['app'], //限定entry特定的块
                excludeChunks: ['dev-helper'], //排除entry特定的块
                filename: 'index.html',
                inject: true,
                hash: true,
                title: 'im小站',
                mountPoint: '<div id="root"></div>',
                // value: '23',
                template: path.resolve('.', 'public', 'index.html') // 模板
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            port: 9000,
            historyApiFallback: true,
        }
    };
    return webpack;
}

module.exports = renderWebpack;
