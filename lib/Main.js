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
         * @type {AddClassModuleCommand}
         */
        let addClassModuleCommand = new index_1.AddClassModuleCommand();
        addClassModuleCommand.setProcess(process);
        this._application.addCommand(addClassModuleCommand);
        /**
         * @type {AddWebComponentModule}
         */
        let addWebComponentModuleCommand = new index_1.AddWebComponentModuleCommand();
        addWebComponentModuleCommand.setProcess(process);
        this._application.addCommand(addWebComponentModuleCommand);
        /**
         * @type {DeleteModuleCommand}
         */
        let deleteModuleCommand = new index_1.DeleteModuleCommand();
        deleteModuleCommand.setProcess(process);
        this._application.addCommand(deleteModuleCommand);
        /**
         * @type {ListModuleCommand}
         */
        let helpCommand = new index_1.ListModuleCommand();
        helpCommand.setProcess(process);
        this._application.addCommand(helpCommand);
    }
    /**
     *
     * @param process
     */
    process() {
        /**
         *
         */
        if (this._application.hasCommandInProcess() === undefined && !this._application.isThirdParameterOption()) {
            console.log(this._application.getProcess().argv[2]);
            if (this._application.getProcess().argv[2]) {
                const chalk = require('chalk');
                console.log(chalk.red.underline.bold(`Command "${this._application.getProcess().argv[2].split(' ')[0]}" not found\n`));
                this._application.getProcess().exit(-1);
            }
            else {
                this._application.getProcess().argv.splice(2, 0, '--help');
            }
        }
        if (this._application.startThirdParameterOptionWith('-h') || this._application.startThirdParameterOptionWith('--help')) {
            const chalk = require('chalk');
            const figlet = require('figlet');
            console.log(chalk.green(figlet.textSync('FLUID NEXT', {
                font: "3D Diagonal",
                horizontalLayout: 'full'
            })));
        }
        this._application.execProcess();
    }
}
exports.Main = Main;
