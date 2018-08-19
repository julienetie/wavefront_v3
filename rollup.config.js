import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
// uncomment this to uglify source code
// import uglify from 'rollup-plugin-uglify';

export default {
  moduleName: "wavefront",
  entry: "src/wavefront.js",
  dest: "dist/wavefront.js",
  format: "iife",
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true
    }),
    commonjs(),
    buble({
      // uncomment this to use `import createElement from 'inferno-create-element';` with jsx
      // jsx: 'createElement',
      objectAssign: 'Object.assign'
    })
    // uncomment this to uglify source code
    // uglify()
  ]
}