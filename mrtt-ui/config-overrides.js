const path = require('path')
const webpack = require('webpack')

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    buffer: require.resolve('buffer/')
  })
  config.resolve.fallback = fallback
  config.resolve.modules = [path.resolve(__dirname, 'src'), 'node_modules']
  // Linting is oxlint's job (`pnpm lint`), so drop CRA's built-in ESLint pass.
  config.plugins = (config.plugins || [])
    .filter((plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin')
    .concat([
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ])
  return config
}
