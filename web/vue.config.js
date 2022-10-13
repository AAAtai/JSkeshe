const { defineConfig } = require('@vue/cli-service')
const webpack=require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host:'0.0.0.0',
    // public:'192.168.3.166',
    port:'8080',
    https:false,
  },
  configureWebpack:{
    plugins:[
        new webpack.ProvidePlugin({
          $:'jquery',
          jQuery:'jquery',
          'windows.JQuery':'jquery'
        })
    ]
  }
})
