"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const index_1 = require("./command/index");
class Main {
    /**
     *
     * @param {object} config  package.json object
     * @param process
     */
    constructor(config, process) {
        this._application = new Application_1.Application(config, process);
        /**
         * @type {CreateModuleCommand}
         */
        let createModuleCommand = new index_1.CreateModuleCommand();
        createModuleCommand.setProcess(process);
        this._application.addCommand(createModuleCommand);
        /**
         * @type {ListCommand}
         */
        let helpCommand = new index_1.ListCommand();
        helpCommand.setProcess(process);
        this._application.addCommand(helpCommand);
        helpCommand.setCommands(this._application.getCommands());
    }
    /**
     *
     * @param process
     */
    process() {
        if (this._application.hasCommandInProcess() === undefined && !this._application.isThirdParameterOption()) {
            if (this._application.getProcess().argv[2]) {
                const chalk = require('chalk');
                console.log(chalk.red.underline.bold(`Command "${this._application.getProcess().argv[2].split(' ')[0]}" not found\n`));
            }
            // WORKAROUND to set default
            this._application.getProcess().argv.splice(2, 0, 'list');
        }
        this._application.execProcess();
    }
}
exports.Main = Main;
