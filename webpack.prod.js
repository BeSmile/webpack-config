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
    var webpackConfig = merge(config, {
        mode: "production",
        devtool: 'inline-source-map',
        plugins: [
            ...config.plugins,
            // new HardSourceWebpackPlugin(), // 提升加载速度,为模块提供中间缓存步骤
            new WebpackChunkHash(),
            new ManifestPlugin(),
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
            new webpack.HashedModuleIdsPlugin(), // NamedModulesPlugin
            // new InlineManifestWebpackPlugin('chunk-manifest.json'),// 重命名 manifest json
        ]
    });

    rm(distPath, async function(err) {
        if (!err) {
            spinner.succeed('cleaned dist folder success');

            spinner.text = 'building';
            spinner.start();

            webpack(webpackConfig, function(err, status) {
                if (!err) {
                    spinner.succeed(`build dist success. the output path:${distPath}`);
                }
            })
        } else {
            spinner.fail('rm dist error');
        }
    })
}

module.exports = renderWebpack;
