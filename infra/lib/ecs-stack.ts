import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'UserApiVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    const cluster = new ecs.Cluster(this, 'UserApiCluster', { vpc });

    const repo = ecr.Repository.fromRepositoryName(this, 'UserApiEcr', 'userapi');

    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'UserApiService', {
      cluster,
      cpu: 512,
      memoryLimitMiB: 1024,
      desiredCount: 2,
      listenerPort: 80,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repo, 'latest'),
        containerPort: 8080,
        environment: {
          'SPRING_PROFILES_ACTIVE': 'prod',
          'SPRING_DATASOURCE_URL': 'jdbc:postgresql://replace-me:5432/userapi',
          'SPRING_DATASOURCE_USERNAME': 'userapi',
          'SPRING_DATASOURCE_PASSWORD': 'password'
        }
      },
      publicLoadBalancer: true,
    });

    fargateService.targetGroup.configureHealthCheck({
      path: '/actuator/health',
      healthyHttpCodes: '200',
    });

    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
