#!/usr/bin/env node

'use strict';

process.title = 'electron-polymer';


const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const commander = require('commander');
const program = new commander.Command();

// COMMANDS
const files = require('./command/files.js');

program.version('0.0.1');

program
    .command('list')
    .description('List comands')
    .action(() => {
        console.log('setup');
    });

program
    .command('test')
    .description('Test comands')
    .action(() => {
        console.log('test');
    })

let findCmd = process.argv.find((element) => { return 'list' === element }) ||
    process.argv.find((element) => { return 'test' === element });

console.log(process.argv);
console.log(findCmd);

switch (findCmd) {
    case 'list' :
    case 'test' :
        program.parse(process.argv);
        break;
    default:
        console.log(
            chalk.green(
                figlet.textSync('FLUID NEXT', { horizontalLayout: 'full' })
            )
        );
}
