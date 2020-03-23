const {
  override,
  fixBabelImports,
  addBabelPlugins,
  useBabelRc
} = require("customize-cra");

const rootImportConfig = [
  "babel-plugin-root-import",
  {
    rootPathSuffix: "./src",
    rootPathPrefix: "~"
  }
];
module.exports = override(
  useBabelRc(),
  ...addBabelPlugins(rootImportConfig)
);
