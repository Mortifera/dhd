import chalk from "chalk";
import { exec, ExecException, execSync } from "child_process";

const s3BucketName = "doghousediamondstack-datasyncce22d76d-15sp98shj7ihh";
const fakeDirectoryName = "CloudServer";

export interface SyncOpts {
    upload: boolean;
    download: boolean;
}

export function sync(opts: SyncOpts) {
    if ((!opts.upload && !opts.download) || (opts.upload && opts.download)) {
        upload();
        download();
    } else if (opts.upload) {
        upload();
    } else if (opts.download) {
        download();
    } else {
        console.log(chalk.red("No action taken"));
    }
}

function download() {
    console.log(chalk.blue("Downloading cloud server files"));
    execSync(`aws s3 sync s3://${s3BucketName} .`, parseResponse);
}

function upload() {
    console.log(chalk.blue("Uploading cloud server files"));
    execSync(`aws s3 sync --sse=AES256 . s3://${s3BucketName}`, parseResponse);
}

function parseResponse(error: ExecException | null, stdout: string, stderr: string) {
    if (error) {
        console.log(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`Error: ${stderr}`);
        return;
    }
    console.log(`${cleanOutput(stdout)}`);
};

function cleanOutput(stdout: string): string {
    return stdout.replace("s3://" + s3BucketName, fakeDirectoryName)
        .replace(s3BucketName, fakeDirectoryName)
        .replace(`s3://${fakeDirectoryName}`, fakeDirectoryName);
}