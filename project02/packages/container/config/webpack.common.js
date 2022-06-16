const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require("../package.json");

module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',  // transform .jsx
                            '@babel/preset-env',    // transform js to ES5
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}
