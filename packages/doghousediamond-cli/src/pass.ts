import * as AWS from 'aws-sdk';
import chalk from 'chalk';
import * as readline from 'readline-sync';
import * as securePass from 'secure-random-password';

const region = "eu-west-1";
const tableName = "DogHouseDiamondStack-PassTable33D248DE-1SW1J989W1YEU";
const kmsKeyId = "arn:aws:kms:eu-west-1:226486444922:key/e78890ad-a74d-4c58-9e8a-f2adc880de88";

interface PutPassData {
    service: string;
    user: string;
    password: string;
}

interface UserPass {
    user: string;
    password: string;
}

export interface NewPassData {
    service: string;
    user: string;
}

export async function listServices() {
    const ddbClient = new AWS.DynamoDB({ region });

    const tableResults = await ddbClient.scan({
        TableName: tableName,
    }).promise();

    if (!tableResults.Items || tableResults.Items.length<=0) {
        console.log("No services currently in use.");
    } else {
        console.log("List of services in use: \n" + tableResults.Items.map(item => item.service.S!).join("\n") + "\n");
    }
}

export async function newPassword(newPassData: NewPassData) {
    const password = securePass.randomPassword({ characters: securePass.lower + securePass.upper + securePass.digits });

    await putPassData({
        ...newPassData,
        password
    });

    console.log("Password:", password);
}

export async function putPassData(putPassData: PutPassData) {
    const ddbClient = new AWS.DynamoDB({ region });

    const service = putPassData.service;

    const itemExists: boolean = (await ddbClient.getItem({
        TableName: tableName,
        Key: {
            "service": {
                "S": service
            }
        }
    }).promise()).Item !== undefined;

    if (itemExists) {
        console.log("User/Password already exists for this service");

        const overwrite = readline.keyInYN("Do you want to overwrite?", { defaultInput: "N"});
    
        if (!overwrite) {
            console.log("No action taken");
            return;
        }
    }

    const userPass: UserPass = {
        user: putPassData.user,
        password: putPassData.password
    };

    try {
        const encryptedData = await encrypt(JSON.stringify(userPass));

        await ddbClient.putItem({
            TableName: tableName,
            Item: {
                "service": {
                    "S": service
                },
                "data": {
                    "S": encryptedData
                }
            }
        }).promise();

        console.log("Successfully put user/password for " + service);
    } catch (err) {
        console.log("Error occured", err);
    }
}

interface GetPassDataOpts {
    service: string
}

export async function getPassData(getPassData: GetPassDataOpts) {
    const ddbClient = new AWS.DynamoDB({ region });

    const {
        service
    } = getPassData;

    try {
        const ddbItemResponse = await ddbClient.getItem({
            TableName: tableName,
            Key: {
                "service": {
                    "S": service
                }
            }
        }).promise();

        if (ddbItemResponse.Item === undefined) {
            console.log(chalk.redBright(`No service found with the name '${service}'`));
            return;
        }

        const dataStr = await decrypt(ddbItemResponse.Item.data.S!);

        const userPass: UserPass = JSON.parse(dataStr);

        console.log("User: " + userPass.user);
        console.log("Password: " + userPass.password);
    } catch (err) {
        console.log("Error occured", err);
    }
}

async function encrypt(source: string): Promise<string> {
    const kmsClient = new AWS.KMS({ region });
    const params = {
        KeyId: kmsKeyId,
        Plaintext: source,
    };
    const { CiphertextBlob } = await kmsClient.encrypt(params).promise();

    // store encrypted data as base64 encoded string
    return CiphertextBlob.toString('base64');
}

// source is plaintext
async function decrypt(source: string): Promise<string> {
    const kmsClient = new AWS.KMS({ region });
    const params = {
        CiphertextBlob: Buffer.from(source, 'base64'),
    };
    const { Plaintext } = await kmsClient.decrypt(params).promise();
    return Plaintext.toString();
}
