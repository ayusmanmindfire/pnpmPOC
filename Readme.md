# JS Serverless Monorepo Boilerplate

A high-performance, multi-cloud serverless monorepo built with **Nx**, **pnpm**, and **TypeScript**. This project implements **Hexagonal Architecture** (Ports and Adapters) to keep business logic independent of cloud providers like AWS, Azure, and GCP.

---

## 🏗 Architecture Overview

This project is organized into layers to ensure maximum code reuse and maintainability:

* **`apps/` (Adapters)**: Cloud-specific entry points that translate events (AWS Lambda, Azure Functions, GCP) into internal requests.
* **`libs/application` (Orchestration)**: Services that coordinate data flow between the domain and infrastructure.
* **`libs/domain` (Core Logic)**: Pure business rules and use cases. No dependencies on any cloud or framework.
* **`libs/infrastructure` (Tools)**: External implementations such as logging, database clients, and third-party APIs.

---

## 🛠 Prerequisites

Ensure you have the following installed:
* **Node.js**: v20+ 
* **pnpm**: `npm install -g pnpm`
* **Nx CLI**: `npm install -g nx`
* **Serverless Framework**: `npm install -g serverless` (required for AWS)

---

## 🚀 Getting Started

### 1. Install Dependencies
Run from the root directory:
```bash
pnpm install
```

### 2. Build Your Apps
Nx uses esbuild to bundle each app into a single, tree-shaken production file.

```bash
# Build all cloud providers
npx nx run-many -t build

# Build specific provider
npx nx build aws-greeting-service
npx nx build azure-greeting-service
npx nx build gcp-greeting-service
```

### 3. 🧪 Development Workflow
Adding New Logic
Domain: Add a new use-case in libs/domain/src/use-cases.

Application: Add a service method in libs/application/src/lib to handle the new logic.

Apps: Import the service into your handler in apps/<cloud>/src/main.ts.

Visualize the Graph
To see how your libraries and apps are connected:

```bash
npx nx graph
```
### 4.☁️ Cloud Specifics

🟠 AWS Lambda
Config: apps/aws/greeting-service/serverless.yml

Local Test: npx nx serve aws-greeting-service

🔵 Azure Functions
Version: Node.js v4 Programming Model (app.http)

Files: host.json at the app root.

🟢 Google Cloud Functions
Framework: Uses @google-cloud/functions-framework

Config: apps/gcp/greeting-service/package.json

🛠 Troubleshooting
Error: Cannot find module '@js-serverless/...'

Verify libs/<name>/src/index.ts exists and contains the correct exports.

Ensure tsconfig.base.json contains the correct paths mapping.

Run npx nx reset to clear the Nx cache.
