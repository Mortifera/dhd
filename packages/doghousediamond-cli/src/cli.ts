#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import program from 'commander';

import { sync } from './sync';

clear();
console.log(
    chalk.red(
        figlet.textSync('DHD', { horizontalLayout: 'full' })
    )
);

program
    .version('0.0.1')
    .description("DogHouseDiamond cli")
    .command("sync")
        .description("sync data in current directory with S3")
        .action(sync)
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}