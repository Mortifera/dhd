import { exec } from "child_process";

const s3BucketName = "dhdstreamdatasyncstack-datasyncce22d76d-1rumxlnwizmlo";
const fakeDirectoryName = "CloudServer";

export function sync() {
    exec(`aws s3 sync --sse=AES256 . s3://${s3BucketName}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`Error: ${stderr}`);
            return;
        }
        console.log(`${cleanOutput(stdout)}`);
    });
}

function cleanOutput(stdout: string): string {
    return stdout.replace("s3://" + s3BucketName, fakeDirectoryName)
        .replace(s3BucketName, fakeDirectoryName);
}