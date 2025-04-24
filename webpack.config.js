import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the target package from environment variable or fallback to 'all'
const targetPackage = process.env.TARGET_PACKAGE || 'all';

// Define the entry points dynamically based on the target package
const entries = {
  functionA: './packages/functionA/index.js',
  functionB: './packages/functionB/index.js',
  functionC: './packages/functionC/src/index.js'
};

// If 'all' is selected, use all the entries, otherwise use the selected package
const selectedEntries = targetPackage === 'all' ? entries : { [targetPackage]: entries[targetPackage] };

const configs = Object.entries(selectedEntries).map(([name, entry]) => ({
  target: 'node',
  mode: 'production',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'dist', name),
    filename: 'bundle.js',
    libraryTarget:"commonjs2"
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
}));

export default configs;
