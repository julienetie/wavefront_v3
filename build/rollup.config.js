import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';

export default {
  input: "src/wavefront.js",
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true
    }),
    commonjs(),
        buble({
			target: { chrome: 51, firefox: 48, safari: 9, edge: 14 }
        }),
  ],
  output:{
    name: "wavefront",
    file: "dist/wavefront.js",
    format: 'iife'
  },
  watch: {
    chokidar: true,
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: true
  }
}