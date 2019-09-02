const rules = [{
	test:	/\.css$/,
    use:	[
      {
        loader:	'style-loader',
    	},
      {
        loader:	'css-loader',
        options: {
          modules: true,
          camelCase: true,
        }
    	},
      // {
      //   loader: 'postcss-loader',
      //   options: { parser: 'sugarss', exec: true }
      // }
    ]
  }, {
		test:	/\.less$/,
    use:	[
			'style-loader',
			{ loader: 'css-loader', options: { importLoaders: 1 } },
      {
        loader:	'less-loader',
        options: {
          // noIeCompat: true
					importLoaders: 1,
					modules: true
        }
    	}
    ]
  }, {
	test: /\.scss$/,
    use: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					importLoaders: 1
			 	}
		  },
      {
        loader:	'sass-loader',
        options: {
					modules: true
          // noIeCompat: true
        }
    	}
    ]
  }];

  module.exports = rules;
