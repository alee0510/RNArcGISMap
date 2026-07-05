const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: [path.resolve(__dirname, './')],
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    ],
  ],
};
