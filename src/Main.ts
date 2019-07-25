/**
 *
 */

import {Application} from "./Application";
import { CreateModuleCommand, DeleteModuleCommand, ListModuleCommand, AddClassModuleCommand, AddWebComponentModuleCommand} from "./command/index";
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
         * @type {AddClassModuleCommand}
         */
        let addClassModuleCommand = new AddClassModuleCommand();
        addClassModuleCommand.setProcess(process);
        this._application.addCommand(addClassModuleCommand);
        
        /**
         * @type {AddWebComponentModule}
         */
        let addWebComponentModuleCommand = new AddWebComponentModuleCommand();
        addWebComponentModuleCommand.setProcess(process);
        this._application.addCommand(addWebComponentModuleCommand);

        /**
         * @type {DeleteModuleCommand}
         */
        let deleteModuleCommand = new DeleteModuleCommand();
        deleteModuleCommand.setProcess(process);
        this._application.addCommand(deleteModuleCommand);

        /**
         * @type {ListModuleCommand}
         */
        let helpCommand = new ListModuleCommand();
        helpCommand.setProcess(process);
        this._application.addCommand(helpCommand);
    }

    /**
     *
     * @param process
     */
    public process() {
        /**
         *
         */
        if (this._application.hasCommandInProcess() === undefined && !this._application.isThirdParameterOption()) {

            console.log(this._application.getProcess().argv[2]);
            if (this._application.getProcess().argv[2]) {
                const chalk = require('chalk');
                console.log(
                    chalk.red.underline.bold(`Command "${this._application.getProcess().argv[2].split(' ')[0]}" not found\n`)
                );
                this._application.getProcess().exit(-1);
            } else {
                this._application.getProcess().argv.splice(2, 0, '--help')
            }
        }

        if (this._application.startThirdParameterOptionWith('-h') || this._application.startThirdParameterOptionWith('--help')) {
            const chalk = require('chalk');
            const figlet = require('figlet');

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
        }

        this._application.execProcess();
    }
}
