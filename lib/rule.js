/*
 * @Description: 
 * @Version: 
 * @Author: linjinzhi
 * @Date: 2020-12-29 14:14:24
 * @LastEditors: BeSmile
 * @LastEditTime: 2021-01-18 18:02:52
 */
let rules = [{
  test: /\.(png|jpe?g|gif)$/i,
    use: [
      {
        loader: 'file-loader',
      },
    ],
  }, {
    test: /\.css$/,
    use: [
        require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 1,
            },
        },
    ]
}, {
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
}, {
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
}, ];

function getRule(options) {
    let ts = false;
    if (options.hasOwnProperty('ts')) {
        ts = true;
    }
    if (ts) {
        rules.unshift({
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              !false && {
                loader: 'babel-loader',
                options: { plugins: ['react-hot-loader/babel'] }
              },
              'ts-loader'
            ].filter(Boolean)
        });
        rules.unshift({
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        });
    }
    return rules;
}
module.exports = {
    getRule: getRule
};
