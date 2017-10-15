
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
    {
        entry: {
            app: PATHS.app,
        },
        output: {
            path: PATHS.build,
            filename: '[name].js',
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo',
            }),
        ],
    },
    parts.lintJavaScript({ include: PATHS.app }),
    parts.lintCSS({ include: PATHS.app }),
    parts.loadFonts({
        options: {
            name: '[path][name].[hash].[ext]',
        },
    }),
    parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
    {
        entry: {
            vendor: ['react'],
        },
        output: {
            path: PATHS.build,
            filename: 'js/[name].js',
        },
    },

    parts.EXTRACT_CSS({
        use: ['css-loader', parts.autoprefix()],
    }),

    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
    }),

    parts.loadImages({
        options: {
            limit: 15000,
            name: '[path][name].[hash].[ext]',
        },
    }),

    parts.generateSourceMaps({ type: 'source-map' }),

    parts.extractBundles([
        {
            name: 'vendor',
            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
            ),
        },
    ]),

    parts.clean(PATHS.build),
    parts.minifyJavaScript(),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            // Run cssnano in safe mode to avoid
            // potentially unsafe transformations.
            safe: true,
        },
    }),
    parts.minifyHTML(),
]);

const developmentConfig = merge([

    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),

    parts.POST_CSS(),

    parts.loadImages(),

    {
        output: {
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
    },
    parts.generateSourceMaps({ type: 'cheap-module-eval-source-map'}),
]);

module.exports = (env) => {
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    }
    return merge(commonConfig, developmentConfig);
};