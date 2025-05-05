const path = require('path');

module.exports = {
  entry: './js/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './'),
    },
    compress: true,
    port: 9000,
    host: 'localhost',
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: [{
      context: ['/generate-token'],
      target: 'http://localhost:3000',
      changeOrigin: true
    }]
  },
};
