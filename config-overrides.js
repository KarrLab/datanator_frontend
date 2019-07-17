const { override, fixBabelImports, addBabelPlugins, useBabelRc } = require("customize-cra");

const rootImportConfig = [
    "babel-plugin-root-import",
    {
        rootPathSuffix: "./src",
        rootPathPrefix: "~",        
    }
];
module.exports = override(
    useBabelRc(),
    ...addBabelPlugins(
        rootImportConfig
    ),
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: "css",
    }),
);
