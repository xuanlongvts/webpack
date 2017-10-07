const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

exports.devServer = ({ host, port }) => ({
    devServer: {
        historyApiFallback: true,
        stats: 'errors-only',
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        overlay: {
            errors: true,
            warnings: true,
        },
    },
});

exports.lintJavaScript = ({ include, exclude, options }) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                enforce: 'pre',
                loader: 'eslint-loader',
                options,
            },
        ],
    }, 
});

exports.CSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                include,
                exclude,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
});

exports.SCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                include,
                exclude,
                use: ['style-loader', 'css-loader', 'fast-sass-loader'],
            },
        ],
    },
});

exports.POST_CSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                include,
                exclude,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => ([
                                require('autoprefixer'),
                                require('precss'),
                                require('cssnano'),
                            ]),                                                 
                        },
                    },
                ],
            },
        ],
    },
});

exports.EXTRACT_CSS = ({ include, exclude, use }) => {
    // Output extracted CSS to a file
    const plugin = new ExtractTextPlugin({
        filename: '[name].css',
    });

    return {
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    include,
                    exclude,
                    use: plugin.extract({
                        use,
                        fallback: 'style-loader',
                    }),
                },
            ],
        },
        plugins: [ plugin ],
    };
};

exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => ([
            require('autoprefixer')(),
        ]),
    },
});

exports.purifyCSS = ({ paths }) => ({
    plugins: [
        new PurifyCSSPlugin({ paths }),
    ],
});

exports.lintCSS = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                include,
                exclude,
                enforce: 'pre',
                loader: 'postcss-loader',
                options: {
                    plugins: () => ([
                        require('stylelint')(),
                    ]),
                },
            },
        ],
    },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)$/,
                include,
                exclude,
                use: {
                    loader: 'url-loader',
                    options,
                },
            },
        ],
    },
});