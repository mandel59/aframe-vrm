const umdPackage = {
    mode: 'production',
    entry: `${__dirname}/src/mod.ts`,
    output: {
        path: `${__dirname}/lib`,
        filename: 'aframe-vrm.module.js',
        library: 'aframe-vrm',
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
        'three': 'three',
        'three-vrm': 'three-vrm'
    },
    devtool: 'source-map',
};
const varPackage = Object.assign({}, umdPackage, {
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