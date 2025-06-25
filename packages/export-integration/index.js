require("ts-node/register");
main = require("./src/main");

module.exports = {
    exportOptimizations: main.exportOptimizations
}
