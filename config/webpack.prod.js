const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPligin = require("terser-webpack-plugin")
function getStyleLoader(){
    return [
        MiniCssExtractPlugin.loader, //提取css成单独的文件
        'css-loader', //将css资源编译成commonjs模块到js中
        {
            loader: "postcss-loader",
            options: {
                postcssOptions:{
                    plugins: [
                        'postcss-preset-env'//能解决大多样式兼容性问题
                    ]
                }
            }
        }
    ]//use执行顺序，从右到左（从下到上）
}
module.exports = {
    //入口（相对路径即可）
    entry: './src/main.js',
    //输出
    output: {
        //文件输出路径，要求绝对路径
        path: path.resolve(__dirname, "../dist"),
        filename: "js/main.js",
        //原理在打包前，将path目录清空，再进行打包
        //自动清除上次打包内容
        clean: true
    },
    //加载器
    module: {
        rules: [
            //loader的配置
            {
                //每个文件只能被其中一个loader处理
                oneOf: [
                    {
                        test: /\.css$/,
                        use: getStyleLoader()
                    },
                    //处理图片
                    {
                        test: /\.(png|jpe?g|gif|web)$/,
                        type: "asset",//会在指定条件下转换为base64
                        parser: {
                            dataUrlCondition: {
                                maxSize: 4 * 1024 // 4kb
                            }
                        },
                        generator: {
                            filename: 'static/[hash:10][ext][query]'
                        }

                    },
                    //处理字体库资源
                    {
                        test: /\.(ttf|woff2?)$/,
                        type: "asset/resource",
                        generator: {
                            filename: 'static/media/[hash:10][ext][query]'
                        }

                    },
                    //babel配置
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            {
                                loader: "thread-loader",//开启多进程打包
                                options: {
                                    works: 3//进程数量
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                    cacheDirectory: true,//开启babel缓存
                                    cacheCompression: false,//关闭缓存文件压缩
                                    plugins: ['@babel/plugin-transform-runtime']//减少代码体积
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    //插件
    plugins: [
        //plugin的配置
        new ESLintPlugin({
            context: path.resolve(__dirname,"../src"),
            exclude: 'node_modules',
            cache: true,//开启缓存
            cacheLocation: path.resolve(__dirname,'../node_modules/.cache/eslintcache'),
            threads: 3,//开启多进程
        }),
        new HtmlWebpackPlugin({
            //模板，以public/index.html文件创建新的html文件
            //新的html文件特点，1.结构和原来保持一致 2.自动引入打包的资源
            template: path.resolve(__dirname,'../public/index.html')
        }),
        new MiniCssExtractPlugin({
            filename:'static/css/main.css'
        })
    ],
    optimization: {
        //压缩的操作
        minimizer: [
            //压缩css
            new CssMinimizerPlugin(),
            //压缩js
            new TerserWebpackPligin({
                parallel:3//开启多进程
            })
        ],
        splitChunks: {
            chunks: "all"
        }
    },

    //模式
    mode: 'production',
    devtool: 'source-map'
}