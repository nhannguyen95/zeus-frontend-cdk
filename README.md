# Zeus Frontend Infrastructure (CDK)

## Introduction

This repository contains the AWS Cloud Development Kit (CDK) code for the **Zeus Frontend** infrastructure.

Zeus (a code name for the project) is a platform designed for "LeetCode for DevOps" style challenges. This repository automates the deployment of the frontend application, which provides an interface for users to browse topics, select problems, and interact with a terminal environment.

## Infrastructure Overview

The infrastructure is built using AWS CDK with TypeScript and includes:

- **Static Website Hosting**: An S3 bucket configured for hosting the pre-rendered Next.js frontend.
- **Content Delivery**: (Planned/Internal) CloudFront distribution for global content delivery and HTTPS support.
- **CI/CD Pipeline**: An AWS CodePipeline that orchestrates the build and deployment process, pulling source code from both the frontend (`zeus-frontend`) and infrastructure (`zeus-frontend-cdk`) repositories.

## Project Structure

- **`bin/`**: Entry point for the CDK application.
- **`lib/`**:
  - **`stacks/`**: Definition of the infrastructure stacks (Distribution, Pipeline).
  - **`stages/`**: Deployment stages for different environments.
  - **`constants/`**: Shared constants and configuration.
- **`test/`**: Unit tests for the infrastructure stacks.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
