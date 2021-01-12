import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';
import * as iam from 'monocdk/aws-iam';
import * as ddb from 'monocdk/aws-dynamodb';
import { assert } from 'console';

export class DHDStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, "DataSync", {
            encryption: s3.BucketEncryption.S3_MANAGED
        });

        const passTable = new ddb.Table(this, "PassTable", {
            encryption: ddb.TableEncryption.CUSTOMER_MANAGED,
            partitionKey: {
                name: "service",
                type: ddb.AttributeType.STRING
            }
        });

        const user = new iam.User(this, "DataSyncUser");

        bucket.grantPut(user);
        bucket.grantRead(user);

        passTable.grantReadData(user);
        passTable.grantWriteData(user);

        assert(passTable.encryptionKey);

        passTable.encryptionKey?.grantEncryptDecrypt(user);

        new cdk.CfnOutput(this, "BucketName", {
            value: bucket.bucketName,
        });
        new cdk.CfnOutput(this, "TableName", {
            value: passTable.tableName,
        });
        new cdk.CfnOutput(this, "KMSArn", {
            value: passTable.encryptionKey?.keyArn!,
        });
    }
}
