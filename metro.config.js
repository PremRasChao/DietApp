const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// framer-motion (pulled in by moti on web) ships both CJS and ESM.
// Metro picks the ESM build (.mjs) which then imports tslib/modules/index.js
// (a pure ESM file). Metro's CJS interop of that file leaves tslib.default
// undefined, crashing the bundle. Force framer-motion to its CJS build so
// the tslib require() path works correctly.
const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName === "framer-motion") {
      return {
        filePath: path.resolve(
          __dirname,
          "node_modules/framer-motion/dist/cjs/index.js"
        ),
        type: "sourceFile",
      };
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
