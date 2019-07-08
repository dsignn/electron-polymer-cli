"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const index_1 = require("./command/index");
class Main {
    /**
     * @param {object} config  package.json object
     */
    constructor(config) {
        this._application = new Application_1.Application(config);
        this._application.addCommand(new index_1.CreateModuleCommand());
        let helpCommand = new index_1.ListCommand();
        this._application.addCommand(helpCommand);
        helpCommand.setCommands(this._application.getCommands());
    }
    /**
     *
     * @param process
     */
    process(process) {
        this._application.setProcess(process);
        if (thi_application.hasCommandInProcess() === undefined && !this._application.isThirdParameterOption()) {
            if (this._application.getProcess().argv[2]) {
                const chalk = require('chalk');
                console.log(chalk.red.underline.bold(`Command "${this._application.getProcess().argv[2].split(' ')[0]}" not found\n`));
            }
            // WORKAROUND to set default
            this._application.getProcess().argv.splice(2, 0, 'list');
        }
        this._application.process();
    }
}
exports.Main = Main;
