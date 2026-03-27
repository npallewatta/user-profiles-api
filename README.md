# User Profiles API (Java + ECS/Fargate + ALB)

Java Spring Boot API with JWT auth and OAuth (Google/Github via Cognito/Auth0) ready for Docker and AWS ECS/Fargate deployment.

## Features
- User registration+login
- JWT access/refresh
- OAuth2 login callback
- Profile endpoints (me, by id)
- Docker container
- AWS CDK infra scaffolding

## Quick start
1. Build:
   - `mvn clean package -DskipTests`
2. Run locally:
   - `java -jar target/userapi-0.0.1-SNAPSHOT.jar`
3. Docker build:
   - `docker build -t userapi:latest .`
4. Infra deploy (CDK):
   - `cd infra` then `npm install` then `cdk deploy`.
