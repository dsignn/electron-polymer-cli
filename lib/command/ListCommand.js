"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("../process");
/**
 *
 */
class ListCommand extends process_1.ProcessAware {
    constructor() {
        super(...arguments);
        this.description = 'List command';
        this.name = 'list';
        this.alias = 'li';
        this.option = '';
    }
    action() {
        const chalk = require('chalk');
        const figlet = require('figlet');
        console.log(chalk.green(figlet.textSync('FLUID NEXT', {
            font: "3D Diagonal",
            horizontalLayout: 'full'
        })));
        console.log(chalk.green.underline.bold('List commamd\n'));
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
