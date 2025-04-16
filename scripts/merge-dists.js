import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';

// Manually define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = path.join(__dirname, '..', 'packages');
const distDir = path.join(__dirname, '..', 'dist');

// Clean existing root dist
fse.emptyDirSync(distDir);

// Copy each package's `dist` into root `dist/<packageName>`
fs.readdirSync(packagesDir).forEach(pkgName => {
  const pkgDistPath = path.join(packagesDir, pkgName, 'dist');
  const targetPath = path.join(distDir, pkgName);

  if (fs.existsSync(pkgDistPath)) {
    fse.copySync(pkgDistPath, targetPath);
    console.log(`✔ Copied ${pkgName} to dist/${pkgName}`);
  }
});
