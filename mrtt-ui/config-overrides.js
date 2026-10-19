const path = require('path')
const webpack = require('webpack')

const appTsConfig = path.resolve(__dirname, 'tsconfig.json')

module.exports = {
  // react-scripts rewrites the tsconfig it checks on startup (it forces `moduleResolution: node`
  // and removes `paths`), so point it at a stub and keep tsconfig.json for the real settings.
  paths(paths) {
    return { ...paths, appTsConfig: path.resolve(__dirname, 'tsconfig.cra.json') }
  },
  webpack(config) {
    const fallback = config.resolve.fallback || {}
    Object.assign(fallback, {
      buffer: require.resolve('buffer/')
    })
    config.resolve.fallback = fallback
    config.resolve.alias = { ...config.resolve.alias, '@': path.resolve(__dirname, 'src') }
    // Linting is oxlint's job (`pnpm lint`), so drop CRA's built-in ESLint pass.
    config.plugins = (config.plugins || [])
      .filter((plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin')
      .concat([
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      ])
    // Type-check against the real tsconfig, not the stub react-scripts is pointed at.
    for (const plugin of config.plugins) {
      if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin') {
        plugin.options.typescript.configFile = appTsConfig
      }
    }
    return config
  }
}
