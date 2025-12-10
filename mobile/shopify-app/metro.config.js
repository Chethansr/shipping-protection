const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for symlinked local packages
config.watchFolders = [
  __dirname,
  path.resolve(__dirname, '../webview')
];

// Resolve symlinked modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../webview/node_modules')
];

// Ensure Metro resolves the symlinked package correctly
config.resolver.extraNodeModules = {
  '@narvar/shipping-protection-webview-rn': path.resolve(__dirname, '../webview')
};

module.exports = config;
