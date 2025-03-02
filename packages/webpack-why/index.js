let StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default
let { join } = require('path')

function addStatoscope(limitConfig, check, webpackConfig) {
  if (limitConfig.why) {
    let shouldOpen = process.env.NODE_ENV !== 'test' && !limitConfig.saveBundle

    webpackConfig.plugins.push(
      new StatoscopeWebpackPlugin({
        additionalStats: [limitConfig.compareWith, check.compareWith].filter(
          Boolean
        ),
        name: limitConfig.project,
        open: shouldOpen ? 'file' : false,
        reports: check.uiReports || [],
        saveReportTo: limitConfig.saveBundle
          ? join(limitConfig.saveBundle, 'report.html')
          : undefined,
        saveStatsTo: limitConfig.saveBundle
          ? join(limitConfig.saveBundle, 'stats.json')
          : undefined,
        watchMode: limitConfig.watch
      })
    )
  } else if (limitConfig.saveBundle) {
    webpackConfig.plugins.push(
      new StatoscopeWebpackPlugin({
        open: false,
        saveReportTo: join(limitConfig.saveBundle, 'report.html'),
        saveStatsTo: join(limitConfig.saveBundle, 'stats.json'),
        watchMode: limitConfig.watch
      })
    )
  }
}

let self = {
  async before(config, check) {
    let modifyConfig = check.modifyWebpackConfig

    check.modifyWebpackConfig = function modifyWebpackConfig(webpackConfig) {
      addStatoscope(config, check, webpackConfig)

      if (modifyConfig) {
        return modifyConfig(webpackConfig) || webpackConfig
      }

      return webpackConfig
    }
  },

  name: '@size-limit/webpack-why'
}

module.exports = [self]
