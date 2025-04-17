import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

const packageName = process.argv[2]; // e.g., "functionA"

if (!packageName) {
  console.error('❌ Please specify a package name.');
  process.exit(1);
}

console.log(`🔨 Building ${packageName}...`);
execSync(`cross-env TARGET_PACKAGE=${packageName} webpack --config webpack.config.js`, {
  stdio: 'inherit',
});

const rootDist = path.resolve('dist', packageName);
const packageDist = path.resolve('packages', packageName, 'dist');

fs.ensureDirSync(packageDist);
fs.copySync(rootDist, packageDist);

console.log(`✅ Copied ${packageName} to packages/${packageName}/dist`);
