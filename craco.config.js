const { override, fixBabelImports } = require("customize-cra");

// module.exports = override(
//     //针对antd实现按需打包:根据import来打包
//     //自动打包相关样式,使用babel-plugin-import
//     fixBabelImports("import", {
//         libraryName: "antd",
//         libraryDirectory: "es",
//         // style: "css"
//         style: true,
//     }),
//     // 修改主题颜色
//     addLessLoader({
//         lessOptions: {
//             javascriptEnabled: true,
//             modifyVars: { '@primary-color': 'orange' },
//         }
//     }),

// );


const CracoLessPlugin = require('craco-less');
module.exports = {
    babel: {
        plugins:
            [
                [
                    "import",
                    {
                        "libraryName": "antd",
                        "libraryDirectory": "es",
                        "style": "css"
                    }
                ]
            ]
    },
    rules: [{
        test: /\.less$/,
        use: [{
            loader: 'style-loader',
        }, {
            loader: 'css-loader', // translates CSS into CommonJS
        }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
                lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                    modifyVars: {
                        'primary-color': 'orange',
                        'link-color': '#1DA57A',
                        'border-radius-base': '2px',
                    },
                    javascriptEnabled: true,
                },
            },
        }],
        // ...other rules
    }],
};

