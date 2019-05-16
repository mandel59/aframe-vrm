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
}
module.exports = base