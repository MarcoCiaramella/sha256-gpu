
module.exports = {
  entry: {
    index: './test/index.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/test/dist/js',
  },
  experiments: {
    topLevelAwait: true,
  }
};