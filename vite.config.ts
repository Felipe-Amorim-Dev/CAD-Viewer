import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CadViewer',
      formats: ['es', 'umd'],

      fileName: (format) => {
        if (format === 'es') {
          return 'cad-viewer.js';
        }

        return 'cad-viewer.umd.cjs';
      }
    },

    sourcemap: true,

    rollupOptions: {
      output: {
        assetFileNames: 'cad-viewer.[ext]'
      }
    }
  }
});