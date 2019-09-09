var path = require("path");
var rules = require("./lib/rule.js");


const modelPath = path.resolve(__dirname, '..', 'src', 'models');

function getModel(modelPath) {
    var models = [];

    return new Promise((resolve, reject) => {
        fs.readdir(modelPath, function (err, files) {
          if (err) {
            resolve([]);
          }
          files.forEach(function(filename){
              const res = filename.split(".");
              models.push(res[0]);
          });
          resolve(models);
        });
    })
}

const baseWebpackConfig = {
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
        app: path.resolve(__dirname, '..', 'src', 'index.js')
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            ...rules,
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': 'dev',
            IS_DEV: JSON.stringify(false),
            MODELS: JSON.stringify(models),
        }),
        new HtmlWebpackPlugin({
            chunks: ['app'], //限定entry特定的块
            excludeChunks: ['dev-helper'], //排除entry特定的块
            filename: 'index.html',
            inject: true,
            hash: true,
            mountPoint: '<div id="root"></div>',
            // value: '23',
            template: path.resolve('.', 'public', 'index.html') // 模板
        })
    ],
};


module.exports = baseWebpackConfig;
