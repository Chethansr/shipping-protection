const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the parent package source to watch folders
config.watchFolders = [
  path.resolve(__dirname, '../..'),
];

// Tell Metro where to find modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../../../node_modules'),
];

module.exports = config;
