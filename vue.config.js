const {defineConfig} = require("@vue/cli-service");
module.exports = defineConfig({
    lintOnSave: false,
    transpileDependencies: true,
    devServer: {
        // 自动打开浏览器
        open: true,
        port: 70,
        client: {
            overlay: true
        },
        proxy: {
            '/api': {
                target: `http://114.55.254.24:8081/community`,
                changeOrigin: true,//开启代理
                pathRewrite: {
                    '^/api': ""
                }
            }
        }
    }
});
