import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export interface DistributionStackProps extends cdk.StackProps {
    /**
     * Path to the NextJS static export output directory
     */
    websiteAssetPath: string;
}

export class DistributionStack extends cdk.Stack {
    public readonly websiteUrl: string;

    constructor(scope: Construct, id: string, props: DistributionStackProps) {
        super(scope, id, props);

        // S3 bucket to host the static website
        const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: `zeus-frontend-${this.account}-${this.region}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: '404.html',
            publicReadAccess: true,
            blockPublicAccess: new s3.BlockPublicAccess({
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            }),
        });

        // Deploy website assets to S3
        new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset(props.websiteAssetPath)],
            destinationBucket: websiteBucket,
        });

        this.websiteUrl = websiteBucket.bucketWebsiteUrl;

        // Output the S3 Website URL
        new cdk.CfnOutput(this, 'WebsiteUrl', {
            value: this.websiteUrl,
            description: 'S3 Website URL',
        });
    }
}
