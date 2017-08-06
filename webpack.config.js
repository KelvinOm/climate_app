const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === "dev");

const dirNode = "node_modules";
const dirApp = path.join(__dirname, "app");
const dirAssets = path.join(__dirname, "assets");

/**
 * Webpack Configuration
 */
module.exports = {
    entry: {
        bundle: path.join(dirApp, "index")
    },
    resolve: {
        modules: [
            dirNode,
            dirApp,
            dirAssets
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEV: IS_DEV
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
        }),
    ],
    module: {
        rules: [
            // BABEL
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules)/,
                options: {
                    compact: true
                }
            },

            // CSS / SASS
            {
                test: /\.scss/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: IS_DEV
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: IS_DEV,
                            plugins: [
                                require("autoprefixer")(),
                                require("cssnano")()
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: IS_DEV,
                            includePaths: [dirAssets]
                        }
                    }
                ]
            },

            // JSON
            {
                test: /\.json$/,
                loader: "json-loader"
            },

            // PUG
            {
                test: /\.pug$/,
                loader: "pug-loader"
            },

            // IMAGES
            {
                test: /\.(jpe*g|png|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            }
        ]
    }
};
