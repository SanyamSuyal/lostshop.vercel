// esbuild.config.js
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/index.js',
  format: 'esm',
  plugins: [nodeExternalsPlugin()],
  minify: true,
  sourcemap: true,
  loader: {
    '.ts': 'ts'
  },
}).catch(() => process.exit(1)); 