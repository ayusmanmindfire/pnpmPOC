# --------------------------------------------------------------------
# Stage 1: The "builder" stage
# --------------------------------------------------------------------
# Use a standard Node.js image to create a build environment.
# The 'as builder' names this stage so we can reference it later.
FROM node:20-slim AS builder

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Enable pnpm using corepack (the modern, built-in way).
RUN corepack enable

# Copy the root package.json and the workspace definition file.
# This allows us to install dependencies efficiently.
COPY package.json pnpm-workspace.yaml./

# Install all workspace dependencies. This leverages Docker's layer caching.
# This layer will only be rebuilt if package.json or pnpm-workspace.yaml changes.
RUN pnpm install --frozen-lockfile

# Copy the rest of the monorepo source code into the container.
COPY..

# Define an argument for which service to build. This makes the Dockerfile reusable.
ARG service

# Run the Nx build command for the specified service.
# This will compile our TypeScript and create a bundled output in the dist/ folder.
RUN pnpm nx build ${service}

# --------------------------------------------------------------------
# Stage 2: The "final" production stage
# --------------------------------------------------------------------
# Use an official AWS Lambda base image for Node.js 20. This ensures
# our container is fully compatible with the Lambda runtime environment.
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory to the standard Lambda task root.
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy ONLY the final, bundled JavaScript output from the 'builder' stage.
# This is the key to a small and secure final image.
COPY --from=builder /usr/src/app/dist/apps/aws/${service}/./

# Set the command that Lambda will run when the function is invoked.
# This points to the 'handler' function exported from our bundled 'index.js' file.
CMD [ "index.handler" ]