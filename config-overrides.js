const { override, fixBabelImports, addBabelPlugins } = require('customize-cra');

const rootImportConfig = [
    "root-import",
    {
        rootPathPrefix: "~",
        rootPathSuffix: "src"
    }
];
module.exports = override(
    ...addBabelPlugins(
        rootImportConfig
    ),
      fixBabelImports('import', {
       libraryName: 'antd',
       libraryDirectory: 'es',
    style: 'css',
      }),
     );
