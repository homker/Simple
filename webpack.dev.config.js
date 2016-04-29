var path = require('path'),
    webpack = require('webpack'),
    nodeModelDir = path.join(__dirname, 'node_modules'),
    buildPath = path.resolve(__dirname, './app/build'),
    entryPath = path.resolve(__dirname, './app/src/index.js');


var config = {
    entry: [
        'webpack/hot/dev-server',
        entryPath
    ],
    resolve: {
        extensions: ["", ".js", ".jsx"],
        alias: {}
    },
    devServer: {
        contentBase: buildPath,
        devtool: 'eval',
        hot: true,
        inline: true,
        port: 8080,
        historyApiFallback: true
    },
    devtool: 'eval',
    output: {
        path: buildPath,
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        //Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        //Allows error warnings but does not stop compiling. Will remove when eslint is added
        new webpack.NoErrorsPlugin()
    ],
    module: {
        noParse: [],
        //preLoaders: [
        //    {
        //        //Eslint loader
        //        test: /\.(js|jsx)$/,
        //        loader: 'eslint-loader',
        //        include: [path.resolve(__dirname, "./app/src")],
        //        exclude: [nodeModelDir]
        //    }
        //],
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: [nodeModelDir],
                loaders: ['react-hot', 'babel-loader?optional=runtime&stage=0']
            }, {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=25000'
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    }
};

module.exports = config;