#!/usr/bin/env node

// estrella build script
// ref: https://github.com/rsms/estrella

const pkg = require('./package.json')
const { build } = require('estrella')

build({
    entry: 'src/index.ts',
    outfile: 'dist/ngrammy.esm.min.js',
    bundle: true,
    // esbuild options - https://esbuild.github.io/api/#build-api
    format: 'esm',
    minify: true,
    sourcemap: true,
    target: 'es2015', // ES versions: https://esbuild.github.io/content-types/#javascript
    define: {
        VERSION: JSON.stringify(pkg.version),
    },
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || {})
    ],
}).catch(
    () => process.exit(1)
)
