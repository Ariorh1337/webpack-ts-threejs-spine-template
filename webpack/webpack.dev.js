const { merge } = require('webpack-merge');
const common = require('./webpack.common');

common.plugins[0].userOptions.serviceWorker = '<script></script>';

const dev = {
	mode: 'development',
	stats: 'errors-warnings',
	devtool: 'eval',
	devServer: {
		open: false
	}
}

module.exports = merge(common, dev)
