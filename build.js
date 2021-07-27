#!/usr/bin/env node

// estrella build script
// ref: https://github.com/rsms/estrella

const pkg = require('./package.json')
const { build } = require('estrella')

const common = {
    entry: 'src/index.ts',
    bundle: true,
    // esbuild options - https://esbuild.github.io/api/#build-api
    sourcemap: true,
    target: 'es2015', // ES versions: https://esbuild.github.io/content-types/#javascript
    define: {
        VERSION: JSON.stringify(pkg.version),
    },
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || {})
    ],
}
const production = { ...common, minify: true }
const development = { ...common, debug: true, minify: false, target: 'es2018' }
const browser = { format: 'esm' }
const node = { format: 'cjs', platform: 'node' }

const esmProduction = {
    ...production, ...browser,
    outfile: 'dist/ngrammy.esm.min.js',
}

const esmDevelopment = {
    ...development, ...browser,
    outfile: 'dist/ngrammy.esm.js',
}

const nodeProduction = {
    ...production, ...node,
    outfile: 'dist/ngrammy.min.cjs',
}

const nodeDevelopment = {
    ...development, ...node,
    outfile: 'dist/ngrammy.cjs',
}

const builds = [
    esmProduction,
    esmDevelopment,
    nodeProduction,
    nodeDevelopment,
]

for (const config of builds) {
    build(config)
}
