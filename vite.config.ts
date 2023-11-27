import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

import { vitePluginForArco } from '@arco-plugins/vite-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    // https://github.com/posva/unplugin-vue-router
    VueRouter(),

    // ⚠️ Vue must be placed after VueRouter()
    Vue({
      script: {
        defineModel: true,
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      resolvers: [ArcoResolver()],
      dts: true,
      dirs: ['./src/composables', './src/stores'],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [ArcoResolver({
        resolveIcons: {
          enable: true,
        },
        sideEffect: false,
      })],
      dts: true,
    }),

    vitePluginForArco({
      style: 'css',
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  ],
})
