const { FlatCompat } = require('@eslint/eslintrc');
const nxPlugin = require('@nx/eslint-plugin');

// Helper to bridge compatibility between old and new ESLint config formats
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = {
  plugins: [nxPlugin],
  rules: {
    '@nx/enforce-module-boundaries': [
      'error',
      {
        depConstraints: [
          {
            sourceTag: 'provider:azure',
            onlyDependOnLibsWithTags: ['provider:azure', 'shared'],
          },
          {
            sourceTag: 'provider:gcp',
            onlyDependOnLibsWithTags: ['provider:gcp', 'shared'],
          },
          {
            sourceTag: 'provider:aws',
            onlyDependOnLibsWithTags: ['provider:aws', 'shared'],
          },
          {
            sourceTag: 'shared',
            onlyDependOnLibsWithTags: ['shared'],
          },
        ],
      }
    ],
  },
};
