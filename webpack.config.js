const path = require('path');
const fs = require('fs');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    devtool: 'source-map',
    entry: {
        background: './src/background.js',
        'background-api': './src/background-api.js',
        consts: './src/consts.js',
        content: './src/content.js',
        GetLoginApi: './src/GetLoginApi.js',
        popup: './src/popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {from: 'src/img', to: 'img'},
                {from: 'src/**.html', to: '', flatten: true,},
                {from: 'src/manifest.json', to: '',},
            ],
        }),
        // new webpack.SourceMapDevToolPlugin({})
    ],
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 1234,
        https: {
            key: fs.readFileSync('./webpack-key.pem'),
            cert: fs.readFileSync('./webpack-cert.pem'),
            //ca: fs.readFileSync('/path/to/ca.pem'),
        }
    }
}
