import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { DbStack } from './db-stack';

export interface EcsStackProps extends cdk.StackProps {
  dbStack: DbStack;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    const { dbStack } = props;
    const vpc = dbStack.vpc;
    const dbEndpoint = dbStack.dbInstance.dbInstanceEndpointAddress;
    const dbSecret = dbStack.dbSecret;

    const cluster = new ecs.Cluster(this, 'UserApiCluster', { vpc });

    const repo = ecr.Repository.fromRepositoryName(this, 'UserApiEcr', 'userapi');
    const imageTag = this.node.tryGetContext('imageTag') || 'latest';

    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'UserApiService', {
      cluster,
      cpu: 512,
      memoryLimitMiB: 1024,
      desiredCount: 2,
      listenerPort: 80,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repo, imageTag),
        containerPort: 8080,
        environment: {
          'SPRING_PROFILES_ACTIVE': 'prod',
          'SPRING_DATASOURCE_URL': `jdbc:postgresql://${dbEndpoint}:5432/userapi`,
          'SPRING_DATASOURCE_USERNAME': 'userapi',
        },
        secrets: {
          'SPRING_DATASOURCE_PASSWORD': ecs.Secret.fromSecretsManager(dbSecret, 'password'),
        },
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
