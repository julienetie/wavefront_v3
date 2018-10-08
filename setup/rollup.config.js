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
	     target: { chrome: 61, firefox: 53, safari: 10, edge: 15 }
    }),
  ],
  output:{
    name: "wavefront",
    file: "dist/wavefront.js",
    format: 'es'
  },
  watch: {
    chokidar: true,
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: true
  }
}