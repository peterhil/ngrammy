#!/usr/bin/env ts-node

// esbuild config
// ref: https://esbuild.github.io/api/#build-api

const pkg = require('./package.json')
const es = require('esbuild')

es.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/ngrammy.esm.js',
    bundle: true,
    sourcemap: true,
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || {})
    ],
}).catch(
    () => process.exit(1)
)
