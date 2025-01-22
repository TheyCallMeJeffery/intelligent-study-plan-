const path = require('path');

module.exports = {
  entry: './index.web.js', 
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, 
        use: [
          'style-loader', 
          'css-loader', 
        ],
      },
    ],
  },
  devServer: {
    static: './build', 
    hot: true,
  },
};
