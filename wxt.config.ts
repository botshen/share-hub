import { defineConfig } from 'wxt';
import Icons from "unplugin-icons/vite";
import Tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: 'chrome',
  modules: [
    "@wxt-dev/module-vue",
    "@wxt-dev/i18n/module",
    "@wxt-dev/auto-icons",
  ],
  runner: {
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  vite: () => ({
    plugins: [Icons({ compiler: "vue3" }), Tailwindcss() as any],
    ssr: {
      // List any dependencies that depend on webextension-polyfill here for vite-node importer to work
      noExternal: ["@webext-core/proxy-service", "@webext-core/messaging"],
    },
  }),
  manifest: {
    permissions: [

    ],
    web_accessible_resources: [
      {
        resources: ['/injected.js'],
        matches: ['https://x.com/*'],
      },
    ],
    host_permissions: [
      '<all_urls>'
    ]
  },
  autoIcons: {
    grayscaleOnDevelopment: false,
  },
});
