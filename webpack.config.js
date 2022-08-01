const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin');
module.exports = {
    //入口（相对路径即可）
    entry: './src/main.js',
    //输出
    output: {
        //文件输出路径，要求绝对路径
        path: path.resolve(__dirname, "dist"),
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
                test: /\.css$/,
                use: [
                    'style-loader', //将js中css通过创建style标签添加到HTML文件中生效
                    'css-loader' //将css资源编译成commonjs模块到js中
                ]//use执行顺序，从右到左（从下到上）
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

            }
        ]
    },
    //插件
    plugins: [
        //plugin的配置
        new ESLintPlugin({
            context: path.resolve(__dirname,"src")
        })
    ],
    //模式
    mode: 'development'
}