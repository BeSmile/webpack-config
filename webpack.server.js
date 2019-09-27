var InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
var WebpackChunkHash = require("webpack-chunk-hash");
var baseWebpackConfig = require('./webpack.base');
var merge = require('webpack-merge');
var webpack = require("webpack");
var path = require("path");
var rm = require("rimraf");
const ora = require('ora');

const distPath = path.resolve(__dirname, '..', 'dist');
const spinner = new ora({
    text: 'start building',
    // spinner: process.argv[2]
});
async function renderWebpack() {
    var config = await baseWebpackConfig();
    const webpackConfig =  merge(config, {
        mode: "development",
        devtool: 'source-map',
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            port: 9000,
            historyApiFallback: true,
        },
        plugins: [
            ...config.plugins,
            // new InlineManifestWebpackPlugin('chunk-manifest.json'),// 重命名 manifest json
        ]
    });
    return webpackConfig;
}
module.exports = renderWebpack;
