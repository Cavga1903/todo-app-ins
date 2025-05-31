module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './app',
            '@components': './app/components',
            '@constants': './app/constants',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};