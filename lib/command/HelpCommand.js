"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class HelpCommand {
    constructor() {
        this.description = 'Help command';
        this.name = 'help';
    }
    action() {
        const chalk = require('chalk');
        const figlet = require('figlet');
        console.log(chalk.green(figlet.textSync('FLUID NEXT', {
            font: "3D Diagonal",
            horizontalLayout: 'full'
        })));
        console.log(this._commands);
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
exports.HelpCommand = HelpCommand;
