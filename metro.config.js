const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.sourceExts.push('cjs');

// Firebase ESM override
// https://github.com/expo/expo/issues/36598#issuecomment-2848750540
config.resolver.resolveRequest = (context, moduleImport, platform) => {
  if (moduleImport.startsWith('@firebase/')) {
    return context.resolveRequest(
      {
        ...context,
        isESMImport: true,
      },
      moduleImport,
      platform
    );
  }

  return context.resolveRequest(context, moduleImport, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
