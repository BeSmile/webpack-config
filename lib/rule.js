let rules = [{
        test: /\.css$/i,
        exclude: /\.lazy\.css$/i,
        use: ['style-loader', 'css-loader'],
    }, {
        test: /\.lazy\.css$/i,
        use: [{
            loader: "style-loader",
            // options: { injectType: 'lazyStyleTag' },
        }, {
            loader: 'css-loader',
            options: {
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
            },
        }, ]
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
    },
];
function getRule(options) {
    let ts = false;
    if (options.hasOwnProperty(ts)) {
        ts = true;
    }
    if (ts) {
        rules.push({
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        });
        rules.push({
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader"
        });
    }
    return rules;
}
module.exports = {
    getRule: getRule
};
