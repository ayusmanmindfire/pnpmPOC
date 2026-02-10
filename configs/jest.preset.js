const path = require('path');

module.exports = {
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@js-serverless/domain$': path.resolve(__dirname, '../libs/domain/src/index.ts'),
    '^@js-serverless/application$': path.resolve(__dirname, '../libs/application/src/index.ts'),
    '^@js-serverless/infrastructure$': path.resolve(__dirname, '../libs/infrastructure/src/index.ts'),
  },
  verbose: true,
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};