import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify-es';
import gzip from 'rollup-plugin-gzip';

export default {
  input: "src/index.js",
  plugins: [
    commonjs(),
    nodeResolve({
      jsnext: true,
      browser: true
    }),
    buble({
	     target: { chrome: 61, firefox: 53, safari: 10, edge: 15 }
    }),
    uglify(),
    gzip({
      customCompression: content => compress(Buffer.from(content)),
      fileName: 'gz'
    })
  ],
  output:{
    name: "wavefront",
    file: "./setup/size/minified",
    format: 'es'
  },
  watch: {
    chokidar: true,
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: true
  }
}