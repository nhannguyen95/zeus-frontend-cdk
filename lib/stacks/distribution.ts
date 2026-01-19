import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export interface DistributionStackProps extends cdk.StackProps {
    /**
     * Path to the TanStack Start static export output directory
     */
    websiteAssetPath: string;
}

export class DistributionStack extends cdk.Stack {
    public readonly distributionUrl: string;

    constructor(scope: Construct, id: string, props: DistributionStackProps) {
        super(scope, id, props);

        // S3 bucket to host the static website
        const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: `zeus-frontend-${this.account}-${this.region}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        // CloudFront Origin Access Identity
        // const originAccessIdentity = new cloudfront.OriginAccessIdentity(
        //     this,
        //     'OriginAccessIdentity',
        //     {
        //         comment: 'OAI for Zeus Frontend',
        //     }
        // );

        // Grant read access to CloudFront
        // websiteBucket.grantRead(originAccessIdentity);

        // CloudFront distribution
        // const distribution = new cloudfront.Distribution(this, 'Distribution', {
        //     defaultBehavior: {
        //         origin: new origins.S3Origin(websiteBucket, {
        //             originAccessIdentity,
        //         }),
        //         viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //         cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        //     },
        //     defaultRootObject: 'index.html',
        //     errorResponses: [
        //         {
        //             httpStatus: 403,
        //             responseHttpStatus: 200,
        //             responsePagePath: '/index.html',
        //             ttl: cdk.Duration.minutes(5),
        //         },
        //         {
        //             httpStatus: 404,
        //             responseHttpStatus: 200,
        //             responsePagePath: '/index.html',
        //             ttl: cdk.Duration.minutes(5),
        //         },
        //     ],
        // });

        // Deploy website assets to S3
        // new s3deploy.BucketDeployment(this, 'DeployWebsite', {
        //     sources: [s3deploy.Source.asset(props.websiteAssetPath)],
        //     destinationBucket: websiteBucket,
        //     distribution,
        //     distributionPaths: ['/*'],
        // });

        // this.distributionUrl = `https://${distribution.distributionDomainName}`;

        // Output the CloudFront URL
        // new cdk.CfnOutput(this, 'DistributionUrl', {
        //     value: this.distributionUrl,
        //     description: 'CloudFront distribution URL',
        // });
    }
}
