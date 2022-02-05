const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer(),
  ],

  resolve: { alias: { '@': path.resolve(__dirname, './') } },

  build: {
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.js'),
      name: 'Phi',
      fileName: (format) => `phi.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: { vue: 'Vue' },
      },
    },
  },
})
