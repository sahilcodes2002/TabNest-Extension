const autoprefixer = require('autoprefixer')
const CopyPlugin  = require('copy-webpack-plugin')
const loader = require('css-loader')
const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')
const tailwindcss = require('tailwindcss')

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/popup/popup.jsx'),
        options: path.resolve('./src/options/options.tsx'),
        background: path.resolve('./src/background/background.js'),
        contentScript: path.resolve('./src/contentScript/contentScript.js')
    },
    module: {
        rules: [
            { test: /\.jsx?$/, 
                exclude: /node_modules/, 
                use: { 
                    loader: 'babel-loader', 
                    options: { 
                        presets: [
                            '@babel/preset-env', 
                            '@babel/preset-react'
                        ],
                    },
                },
            },
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader','css-loader',{
                    loader: 'postcss-loader',
                    options:{
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [tailwindcss, autoprefixer]
                        }
                    }
                }],
                test: /\.css$/i,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                use: 'asset/resource'
              },
        ]
    },
    plugins: [
        new CopyPlugin ({
            patterns: [
                { from: path.resolve('src/static') , 
                to: path.resolve('dist') 
                },
            ]
        }),
        ...getHtmlPlugins([
            'popup',
            'options',
        ])
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }, 
    output: {
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
}


function getHtmlPlugins(chunks){
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks:[chunk]
    }))
}