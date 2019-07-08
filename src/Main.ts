/**
 *
 */

import {Application} from "./Application";
import {CreateModuleCommand, ListCommand} from "./command/index";
import * as process from "process";
export class Main {

    /**
     * @type {Application}
     * @private
     */
    private _application: Application;

    /**
     *
     * @param {object} config  package.json object
     * @param process
     */
    constructor(config, process) {

        this._application = new Application(config, process);

        /**
         * @type {CreateModuleCommand}
         */
        let createModuleCommand = new CreateModuleCommand();
        createModuleCommand.setProcess(process);
        this._application.addCommand(createModuleCommand);

        /**
         * @type {ListCommand}
         */
        let helpCommand = new ListCommand();
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
                console.log(
                    chalk.red.underline.bold(`Command "${this._application.getProcess().argv[2].split(' ')[0]}" not found\n`)
                );
            }
            // WORKAROUND to set default
            this._application.getProcess().argv.splice(2, 0, 'list')
        }

        this._application.execProcess();
    }
}
