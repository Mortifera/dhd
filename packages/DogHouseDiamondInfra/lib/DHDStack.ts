import * as cdk from 'monocdk';
import * as s3 from 'monocdk/aws-s3';
import * as iam from 'monocdk/aws-iam';
import * as ddb from 'monocdk/aws-dynamodb';
import * as kms from 'monocdk/aws-kms';
import { assert } from 'console';

export class DHDStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, "DataSync", {
            encryption: s3.BucketEncryption.S3_MANAGED
        });

        const passTable = new ddb.Table(this, "PassTable", {
            encryption: ddb.TableEncryption.AWS_MANAGED,
            partitionKey: {
                name: "service",
                type: ddb.AttributeType.STRING
            },
            billingMode: ddb.BillingMode.PAY_PER_REQUEST
        });

        const passTableKmsKey = new kms.Key(this, "PassTableEncryptionKey", {
            description: "To be used to encrypt/decrypt data in " + passTable.tableName + " ddb table",
            enableKeyRotation: false
        });

        const user = new iam.User(this, "DataSyncUser");

        bucket.grantPut(user);
        bucket.grantRead(user);

        passTable.grantReadData(user);
        passTable.grantWriteData(user);

        passTableKmsKey.grantEncryptDecrypt(user);

        new cdk.CfnOutput(this, "BucketName", {
            value: bucket.bucketName,
        });
        new cdk.CfnOutput(this, "TableName", {
            value: passTable.tableName,
        });
        new cdk.CfnOutput(this, "KMSKeyId", {
            value: passTableKmsKey.keyId,
        });
    }
}
