import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
//import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    base: './',
    plugins: [
        copy({
          targets: [
            {src: 'node_modules/@esri/calcite-components/dist/calcite/assets/', dest: 'public/'}
          ]
        })
    ]
});