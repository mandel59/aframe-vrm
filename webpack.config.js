const base = {
    mode: 'production',
    entry: `${__dirname}/src/mod.ts`,
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
    devtool: 'source-map',
};
const umdPackage = Object.assign({}, base, {
    output: {
        path: `${__dirname}/lib`,
        filename: 'aframe-vrm.module.js',
        library: 'aframe-vrm',
        libraryTarget: 'umd'
    },
    externals: {
        'aframe': 'aframe',
        'three': 'three',
        'three-vrm': 'three-vrm'
    },
})
const varPackage = Object.assign({}, base, {
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