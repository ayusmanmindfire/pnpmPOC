# PNPM Functions Bundler

This project demonstrates how to bundle multiple independent Node.js functions (like `functionA`, `functionB`) using **Webpack**, **PNPM workspaces**, and **Babel**.

Each function lives in its own folder under `packages/`, and is bundled separately into the `dist/` folder.

---

### 1. Install Dependencies
This will add all dependencies according to their respective packages
```bash
pnpm -r install
```

### 2. Build
Run build command in root directory

This will generate build files in root directory for all packages together
```bash
pnpm build

```
This will generate build files in specific package, you can use functionB as well. According to your package you can mention build commands in package.json file

```bash
pnpm build:functionA

```