const webpack = require('webpack');
const config = require('./webpackconfig');

function runWebpack() {

    return new Promise(resolve => webpack(config, (err, stats) => {

        if (err) console.log('Webpack', err)

        console.log(stats.toString({ /* stats options */ }))

        resolve();
    }))
}

module.exports = { config, runWebpack }