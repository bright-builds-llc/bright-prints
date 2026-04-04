# bright-prints

<!-- coding-and-architecture-requirements-readme-badges:begin -->
[![GitHub Stars](https://img.shields.io/github/stars/bright-builds-llc/bright-prints)](https://github.com/bright-builds-llc/bright-prints)
[![License](https://img.shields.io/github/license/bright-builds-llc/bright-prints?s)](./LICENSE)
<!-- coding-and-architecture-requirements-readme-badges:end -->

Bright Prints is an open-source hybrid 3D print portfolio and shopping website built with React Router 7 and intended for Railway deployment.

## Local Development

```bash
pnpm install
pnpm dev
```

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Railway Deployment

This repository includes a Docker-based deployment path for Railway.

Human setup is still required:

1. Link this GitHub repository to a Railway project.
2. Configure autodeploy from the `main` branch.
3. Provision environment variables such as `DATABASE_URL` when the runtime services exist.
