import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import fs from 'fs';
import glob from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPackage = process.env.TARGET_PACKAGE || 'all';

// Dynamically take the entries from packages
const packagesPath = path.join(__dirname, 'packages');

const packageDirs = Object.fromEntries(
  fs
    .readdirSync(packagesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => [dirent.name, dirent.name])
);

const selectedDirs =
  targetPackage === 'all' ? packageDirs : { [targetPackage]: packageDirs[targetPackage] };

const configs = Object.entries(selectedDirs).map(([pkgName, pkgDir]) => {
  const srcDir = path.resolve(__dirname, 'packages', pkgDir, 'src');
  const distDir = path.resolve(__dirname, 'dist', pkgDir);

  // Find all JS files in src directory
  const files = glob.sync('**/*.js', { cwd: srcDir });

  // Construct multiple entry points
  const entries = {};
  files.forEach((file) => {
    const name = file.replace(/\.js$/, ''); // remove .js extension
    entries[name] = path.resolve(srcDir, file);
  });

  // Files to copy if they exist
  const copyTargets = ['host.json', 'local.settings.json']
    .map((f) => {
      const fullPath = path.resolve(__dirname, 'packages', pkgDir, f);
      return fs.existsSync(fullPath)
        ? { from: fullPath, to: path.join(distDir, f) }
        : null;
    })
    .filter(Boolean);

  // Minimal package.json plugin
  class MinimalPackageJsonPlugin {
    apply(compiler) {
      compiler.hooks.afterEmit.tap('MinimalPackageJsonPlugin', () => {
        const pkgJsonPath = path.join(distDir, 'package.json');
        fs.writeFileSync(
          pkgJsonPath,
          JSON.stringify({ main: 'src/{index.js,functions/*.js}' }, null, 2),
          'utf-8'
        );
      });
    }
  }

  return {
    name: pkgName,
    target: 'node',
    mode: 'production',
    entry: entries,
    output: {
      path: path.join(distDir, 'src'),
      filename: '[name].js',
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
      new MinimalPackageJsonPlugin(),
    ],
  };
});

export default configs;
