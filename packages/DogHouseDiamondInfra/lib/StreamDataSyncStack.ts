import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';
import * as iam from 'monocdk/aws-iam';

export class StreamDataSyncStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, "DataSync", {
            encryption: s3.BucketEncryption.S3_MANAGED
        });

        const user = new iam.User(this, "DataSyncUser");

        bucket.grantPut(user);
        bucket.grantRead(user);

        new cdk.CfnOutput(this, "BucketArn", {
            value: bucket.bucketArn,
        });
    }
}
