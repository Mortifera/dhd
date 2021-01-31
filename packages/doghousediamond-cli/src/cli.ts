#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import program from 'commander';
import * as commander from 'commander';

import { sync } from './sync';
import { getPassData, listServices, newPassword, putPassData } from './pass';

clear();
console.log(
    chalk.red(
        figlet.textSync('DHD', { horizontalLayout: 'full' })
    )
);

program
    .version('0.0.1', "-v, --version")
    .description("DogHouseDiamond cli")
    .addHelpCommand();

const subCommand = new commander.Command('sync');
    subCommand
    .description("sync data in current directory with S3")
        .storeOptionsAsProperties(true)
        .option("-u, --upload", "Enables uploading only. No options and no -d provided will cause only upload to occur")
        .option("-d, --download", "Enables downloading only. No options and no -u provided will cause only download to occur")
        .action(sync)
        .addHelpCommand();
program.addCommand(subCommand);

const subCommandPass = new commander.Command('pass');

const subCommandPassList = new commander.Command('list');
subCommandPassList.description("List services for which we already have passwords stored")
    .action(listServices)
    .addHelpCommand();

const subCommandPassGenerate = new commander.Command('generate');
subCommandPassGenerate.description("Generates new password for service user, and sets this service with this new password")
    .aliases(["gen"])
    .storeOptionsAsProperties(true)
    .requiredOption("-s, --service <service-name>", "Name of the service for the user/pass you want to set")
    .requiredOption("-u, --user <user-name>", "Username/email of the service's login")
    .action(newPassword)
    .addHelpCommand();

const subCommandPassGet = new commander.Command('get');
subCommandPassGet.description("Get user/pass")
    .storeOptionsAsProperties(true)
    .requiredOption("-s, --service <service-name>", "Name of the service for the user/pass you want to retrieve")
    .action(getPassData)
    .addHelpCommand();

const subCommandPassSet = new commander.Command('set');
subCommandPassSet.description("Sets service user/pass")
        .storeOptionsAsProperties(true)
        .requiredOption("-s, --service <service-name>", "Name of the service for the user/pass you want to set")
        .requiredOption("-u, --user <user-name>", "Username/email of the service's login")
        .requiredOption("-p, --password <password>", "Password of the service's login")
        .action(putPassData)
        .addHelpCommand();

subCommandPass
    .description("Password manager")
        .addCommand(subCommandPassList)
        .addCommand(subCommandPassGenerate)
        .addCommand(subCommandPassGet)
        .addCommand(subCommandPassSet)
        .addHelpCommand();
program.addCommand(subCommandPass);

// TODO password command
program.parse(process.argv);