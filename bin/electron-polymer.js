#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Main = require('../lib/Main').Main;
const semver = require('semver');
const config = require('../package');

process.title = 'electron-polymer';

// Check controll node version
if (!semver.satisfies(process.version, config.engines.node)) {
    // Strip node version range characters leaving the raw semantic version for output
    let rawVersion = config.engines.node.replace(/[^\d\.]*/, '');
    console.log(
        chalk.green(
            figlet.textSync('FLUID NEXT',
                {
                    font : "3D Diagonal",
                    horizontalLayout: 'full'
                }
            )
        )
    );

    console.log(
        chalk.red(`Electron Polymer CLI requires at least Node v ${rawVersion} You have ${process.version}`)
    );
    process.exit(1);
}

const main = new Main(config, process);

main.process();
