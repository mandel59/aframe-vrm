const webpackMerge = require('webpack-merge');
const umdPackage = {
    mode: 'production',
    entry: `${__dirname}/src/mod.ts`,
    output: {
        path: `${__dirname}/lib`,
        filename: 'aframe-vrm.module.js',
        library: 'vrm',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'ts-loader',
        }]
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    externals: {
        'aframe': 'aframe',
        'three': 'super-three'
    },
    performance: {
        maxEntrypointSize: 800000,
        maxAssetSize: 800000
    }
};
const varPackage = webpackMerge(umdPackage, {
    entry: `${__dirname}/src/use.ts`,
    output: {
        path: `${__dirname}/lib`,
        filename: 'aframe-vrm.js',
    },
    externals: {
        'aframe': 'AFRAME',
        'three': 'THREE',
        'three-vrm': 'THREE',
    },
})
module.exports = [umdPackage, varPackage]