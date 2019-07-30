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
        /**
         *
         */
        this._container = new (require('@dsign/library').container.Container)();
        /**
         * Init container of validations
         */
        this._initValidationContainer();
        this._application = new Application_1.Application(config, process);
        /**
         * @type {CreateModuleCommand}
         */
        let createModuleCommand = new index_1.CreateModuleCommand(this._container);
        createModuleCommand.setProcess(process);
        this._application.addCommand(createModuleCommand);
        /**
         * @type {AddClassModuleCommand}
         */
        let addClassModuleCommand = new index_1.CreateClassModuleCommand(this._container);
        addClassModuleCommand.setProcess(process);
        this._application.addCommand(addClassModuleCommand);
        /**
         * @type {AddWebComponentModule}
         */
        let createWebComponentModuleCommand = new index_1.CreateWebComponentModuleCommand(this._container);
        createWebComponentModuleCommand.setProcess(process);
        this._application.addCommand(createWebComponentModuleCommand);
        /**
         * @type {DeleteModuleCommand}
         */
        let deleteModuleCommand = new index_1.DeleteModuleCommand(this._container);
        deleteModuleCommand.setProcess(process);
        this._application.addCommand(deleteModuleCommand);
        /**
         * @type {ListModuleCommand}
         */
        let helpCommand = new index_1.ListModuleCommand(this._container);
        helpCommand.setProcess(process);
        this._application.addCommand(helpCommand);
    }
    /**
     * @private
     */
    _initValidationContainer() {
        this._container.set('ModuleNameValidation', new (require('@dsign/library').validation.RegExValidation)(index_1.AbstractCommand.REGEX_NAME_MODULE, 'gm'));
        this._container.set('WebComponentNameValidation', new (require('@dsign/library').validation.RegExValidation)(index_1.AbstractCommand.REGEX_NAME_WEB_COMPONENT, 'gm'));
        this._container.set('DirectoryExist', new (require('@dsign/library').validation.DirectoryExistValidator)());
        this._container.set('DirectoryExistInPath', new (require('@dsign/library').validation.DirectoryExistInPathValidator)());
        this._container.set('ClassNameValidation', new (require('@dsign/library').validation.RegExValidation)(index_1.AbstractCommand.REGEX_NAME_CLASS, 'gm'));
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
            console.log(chalk.green(figlet.textSync('DSIGN P-CLI', {
                font: "3D Diagonal",
                horizontalLayout: 'full'
            })));
        }
        this._application.execProcess();
    }
}
exports.Main = Main;
