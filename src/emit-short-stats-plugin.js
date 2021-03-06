/**
 * Emits short stats (js and css files emitted) to file `current.verison`
 *
 * The purpose is to persist state even after the compilation is complete. This
 * file can be used to transfer the current state of compilation on a deployment
 * machine using an external program - like upload assets to CDN, inform other
 * services in your network the current version of compilation, etc...
 *
 * Example:
 *
 *   > plugins: [new EmitShortStatsPlugin({
 *   >   filename: 'current.version.json' // optional
 *   > })]
 *
 *   < // file = current.version
 *   < {
 *   <   js: ['app.198uhc92h323239c.bundle.js'],
 *   <   css: ['bundle.208asndf082nasldk23.css'],
*    <   images: ['example-f1df98cf.png']
 *   < }
 *
 */

import RawSource from 'webpack/lib/RawSource';
import path from 'path';

export default class EmitShortStatsPlugin {
  constructor(opts) {
    this.opts = opts;
  }
  apply(compiler) {

    compiler.plugin('after-compile', (compilation, callback) => {
      var cssArray = [],
        jsArray = [],
        jsFiles = {},
        imgArray = [],
        imgRegExp = (/\.(gif|jpg|jpeg|png|webp|svg)$/i);

      Object.keys(compilation.assets).map(function(a) {
        let ext = path.extname(a);
        switch (true) {
        case ext === '.js':
          jsFiles[a.split('.')[0]] = a;
          break;
        case ext === '.css':
          cssArray.push(a);
          break;
        case imgRegExp.test(ext):
          imgArray.push(a);
          break;
        default:
          // do nothing
        }
      });

      // TODO: support chunks
      jsArray.push(jsFiles['app']);

      var current = {
        js: jsArray,
        css: cssArray,
        images: imgArray
      };

      let outputFilename = (this.opts && this.opts.filename) || 'current.version';

      compilation.assets[outputFilename] = new RawSource(JSON.stringify(current));
      callback();
    });
  }
}
