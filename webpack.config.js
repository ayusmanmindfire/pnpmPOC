import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPackage = process.env.TARGET_PACKAGE || 'all';

const entries = {
  functionA: './packages/functionA/index.js',
  functionB: './packages/functionB/index.js',
  functionC: './packages/functionC/src/index.js',
  functionD: './packages/functionD/src',
};

const selectedEntries =
  targetPackage === 'all' ? entries : { [targetPackage]: entries[targetPackage] };

// Helper: Check if a file exists in the package root
const fileIfExists = (packageName, filename) => {
  const packagePath = path.join(__dirname, 'packages', packageName, filename);
  return fs.existsSync(packagePath)
    ? {
        from: packagePath,
        to: path.join(__dirname, 'dist', packageName, filename),
      }
    : null;
};

// Helper: Custom plugin to generate a minimal package.json
class MinimalPackageJsonPlugin {
  constructor(distPath) {
    this.distPath = distPath;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('MinimalPackageJsonPlugin', () => {
      const packageJsonPath = path.join(this.distPath, 'package.json');
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify({ main: 'bundle.js' }, null, 2),
        'utf-8'
      );
    });
  }
}

const configs = Object.entries(selectedEntries).map(([name, entry]) => {
  const distPath = path.resolve(__dirname, 'dist', name);
  const copyTargets = ['host.json', 'local.settings.json']
    .map((f) => fileIfExists(name, f))
    .filter(Boolean); // remove nulls

  return {
    target: 'node',
    mode: 'production',
    entry,
    output: {
      path: distPath,
      filename: 'bundle.js',
      libraryTarget: 'commonjs2',
    },
    devtool: 'source-map',
    externals: [
      nodeExternals(),
      {
        '@azure/functions-core': 'commonjs @azure/functions-core',
      },
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      ...(copyTargets.length > 0
        ? [new CopyWebpackPlugin({ patterns: copyTargets })]
        : []),
      new MinimalPackageJsonPlugin(distPath),
    ],
  };
});

export default configs;
