const { getDefaultConfig } = require('expo/metro-config');

// expo-router needs this set before getDefaultConfig runs
process.env.EXPO_ROUTER_APP_ROOT = 'app';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
