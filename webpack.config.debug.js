const base = require("./webpack.config.base")
const debugPackage = Object.assign({}, base, {
    mode: 'development',
    output: {
        path: `${__dirname}/debug/lib`,
        filename: 'aframe-vrm.debug.js',
    },
    externals: {
        'aframe': 'AFRAME',
        'three': 'THREE',
        'three-vrm': 'THREE',
    },
    devServer: {
        contentBase: __dirname,
        publicPath: '/debug/lib/',
    }
})
module.exports = [debugPackage]