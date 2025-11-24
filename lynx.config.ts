import { defineConfig } from "@lynx-js/rspeedy";

import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  environments: {
    lynx: {},
    web: {},
  },
  source: {
    alias: {
      "~": "./src",
      "~pages": "./src/pages",
      "~assets": "./src/assets",
      "~components": "./src/components",
      "~utils": "./src/utils",
      "~context": "./src/context",
      "~types": "./src/types",
      // "~hooks": "./src/hooks",
      // "~services": "./src/services",
      "~store": "./src/store",
    },
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
    pluginSass(),
  ],
});
