const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    watch: true,
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'www'),
        compress: true,
        port: 9001,
        historyApiFallback: true,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://localhost:5001',
                pathRewrite: { '^/api': '/api' },
            },
        },
    },
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'bundle.js',
    },
    node: {
        fs: 'empty',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                    },
                    'sass-loader?sourceMap',
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html/,
                use: ['html-loader'],
            },
            {
                test: /\.(svg|gif|png|jpg)(\?v=\d+\.\d+\.\d+)?$/i,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/',
                        },
                    },
                ],
            },
            {
                test: /\.ico/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '/',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 50000,
                        name: './fonts/[name].[ext]', // Output below ./fonts
                        publicPath: '../', // Take the directory into account
                    },
                },
            },
        ],
    },
    plugins: [
        new FaviconsWebpackPlugin({
            logo: './public/favicon.ico',
            prefix: '/',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
            minify: {
                removeComments: true,
                removeRedundantAttributes: true,
            },
        }),
        new CopyWebpackPlugin({
            patterns:[
            {
               from: "./public/stats.json",
               to:   "./stats.json",
            }]})
    ],
}
