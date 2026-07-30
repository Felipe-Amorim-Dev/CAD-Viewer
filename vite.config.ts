import { resolve } from 'node:path';

import { defineConfig } from 'vite';

import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,

      include: [
        'src/**/*.ts'
      ],

      exclude: [
        'vite.config.ts',
        'node_modules',
        'dist'
      ]
    })
  ],

  build: {
    lib: {
      entry: resolve(
        import.meta.dirname,
        'src/index.ts'
      ),

      name: 'CadViewer',

      formats: [
        'es',
        'umd'
      ],

      fileName: (format) => {
        return format === 'es'
          ? 'cad-viewer.js'
          : 'cad-viewer.umd.cjs';
      }
    },

    sourcemap: false,
    emptyOutDir: true,
    copyPublicDir: false,

    rolldownOptions: {
      output: {
        assetFileNames: 'cad-viewer.[ext]'
      }
    }
  }
});