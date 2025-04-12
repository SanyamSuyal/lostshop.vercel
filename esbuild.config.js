// esbuild.config.js
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['server/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/index.js',
  format: 'cjs',
  plugins: [nodeExternalsPlugin()],
  minify: true,
  sourcemap: true,
}).catch(() => process.exit(1)); 