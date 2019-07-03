const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// LIB
const files = require('./lib/files.js');
const inquirer = require('./lib/inquirer.js');

const run = async () => {
    const credentials = await inquirer.askIfIHappy();
    console.log(credentials);
}

clear();

console.log(
    chalk.green(
        figlet.textSync('FLUID', { horizontalLayout: 'full' })
    )
);

run();