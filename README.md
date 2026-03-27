# User Profiles API (Java + ECS/Fargate + ALB)

Java Spring Boot API with JWT auth and OAuth (Google/Github via Cognito/Auth0) ready for Docker and AWS ECS/Fargate deployment.

## Features
- User registration+login
- JWT access/refresh
- OAuth2 login callback
- Profile endpoints (me, by id)
- Docker container
- AWS CDK infra scaffolding
- GitHub Actions CI/CD pipeline

## Quick start
1. Build:
   - `mvn clean package -DskipTests`
2. Run locally:
   - `java -jar target/userapi-0.0.1-SNAPSHOT.jar`
3. Docker build:
   - `docker build -t userapi:latest .`
4. Infra deploy (CDK):
   - `cd infra` then `npm install` then `cdk deploy`.
5. Push to GitHub:
   - `git push origin main` (triggers CI/CD pipeline)

## CI/CD Pipeline

This project includes a GitHub Actions workflow that:
- Builds and tests the Java application
- Builds and pushes Docker image to Amazon ECR
- Deploys infrastructure and application to AWS using CDK

### Setup AWS Credentials in GitHub

To enable deployment, add these secrets to your GitHub repository:
1. Go to your repo > Settings > Secrets and variables > Actions
2. Add:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

Ensure the IAM user has permissions for:
- ECR: `AmazonEC2ContainerRegistryFullAccess`
- ECS: `AmazonECS_FullAccess`
- CDK: `AWSCloudFormationFullAccess`, `IAMFullAccess`

### Pipeline Jobs
- **build-and-test**: Compile, test, and package JAR
- **build-and-push-docker**: Build Docker image and push to ECR (only on main branch push)
- **deploy**: Deploy CDK stack to AWS (only on main branch push)
