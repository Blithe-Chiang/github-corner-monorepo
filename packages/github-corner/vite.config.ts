import { resolve } from 'path'
import { copyFileSync } from 'fs'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/export.js'),
      name: 'GithubCorner',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts({
      afterBuild: () => {
        // copy export file to dist
        const exportFile = resolve(__dirname, 'src/export.js')
        const distFile = resolve(__dirname, 'dist/index.d.ts')
        copyFileSync(exportFile, distFile)
      },
    }),
  ],
})
