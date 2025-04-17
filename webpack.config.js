import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic entry points for each function
const entries = {
  functionA: './packages/functionA/index.js',
  functionB: './packages/functionB/index.js',
};

const configs = Object.entries(entries).map(([name, entry]) => ({
  target: 'node',
  mode: 'production',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'dist', name),
    filename: 'bundle.js',
  },
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
