const path = require("path")
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname,'/dsci-554-projects/project-554sohard') //production path
    :
    '/' //development path
};