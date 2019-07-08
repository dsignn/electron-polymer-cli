"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class ListCommand {
    constructor() {
        this.description = 'List command';
        this.name = 'list';
    }
    action() {
        const chalk = require('chalk');
        const figlet = require('figlet');
        console.log(chalk.green(figlet.textSync('FLUID NEXT', {
            font: "3D Diagonal",
            horizontalLayout: 'full'
        })));
        console.log(chalk.underline('List commamd\n'));
        for (let cont = 0; this._commands.length > cont; cont++) {
            console.log(`    ${this._commands[cont].name}: ${this._commands[cont].description}`);
        }
        console.log(chalk.underline('\n'));
    }
    /**
     * @param {Array<CommandInterface>} commands
     * @return {this}
     */
    setCommands(commands) {
        this._commands = commands;
        return this;
    }
}
exports.ListCommand = ListCommand;
