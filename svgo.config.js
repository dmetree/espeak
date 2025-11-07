module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'removeViewBox',
      active: false,
    },
    'removeDimensions',
    'sortAttrs',
  ],
};
