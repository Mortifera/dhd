#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import program from 'commander';
import * as commander from 'commander';

import { sync } from './sync';

clear();
console.log(
    chalk.red(
        figlet.textSync('DHD', { horizontalLayout: 'full' })
    )
);

program
    .version('0.0.1', "-v, --version")
    .description("DogHouseDiamond cli");

const subCommand = new commander.Command('sync');
    subCommand
    .description("sync data in current directory with S3")
        .storeOptionsAsProperties(true)
        .option("-u, --upload", "Enables uploading only. No options and no -d provided will cause only upload to occur")
        .option("-d, --download", "Enables downloading only. No options and no -u provided will cause only download to occur")
        .action(sync)
        .addHelpCommand();
program.addCommand(subCommand);

program.parse(process.argv);