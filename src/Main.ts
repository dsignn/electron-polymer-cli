/**
 *
 */

import {Application} from "./Application";
import { CreateModuleCommand, DeleteModuleCommand, ListModuleCommand, CreateClassModuleCommand, CreateWebComponentModuleCommand, AbstractCommand} from "./command/index";
import {ContainerInterface} from "@fluidnext/library/src/container/index";
export class Main {

    /**
     * @type {Application}
     * @private
     */
    private _application: Application;

    /**
     *
     */
    private _container: ContainerInterface = new (require('@fluidnext/library').container.Container)();

    /**
     *
     * @param {object} config  package.json object
     * @param process
     */
    constructor(config, process) {

        /**
         * Init container of validations
         */
        this._initValidationContainer();

        this._application = new Application(config, process);

        /**
         * @type {CreateModuleCommand}
         */
        let createModuleCommand = new CreateModuleCommand(this._container);
        createModuleCommand.setProcess(process);
        this._application.addCommand(createModuleCommand);

        /**
         * @type {AddClassModuleCommand}
         */
        let addClassModuleCommand = new CreateClassModuleCommand(this._container);
        addClassModuleCommand.setProcess(process);
        this._application.addCommand(addClassModuleCommand);
        
        /**
         * @type {AddWebComponentModule}
         */
        let createWebComponentModuleCommand = new CreateWebComponentModuleCommand(this._container);
        createWebComponentModuleCommand.setProcess(process);
        this._application.addCommand(createWebComponentModuleCommand);

        /**
         * @type {DeleteModuleCommand}
         */
        let deleteModuleCommand = new DeleteModuleCommand(this._container);
        deleteModuleCommand.setProcess(process);
        this._application.addCommand(deleteModuleCommand);

        /**
         * @type {ListModuleCommand}
         */
        let helpCommand = new ListModuleCommand(this._container);
        helpCommand.setProcess(process);
        this._application.addCommand(helpCommand);
    }

    /**
     * @private
     */
    _initValidationContainer() {

        this._container.set(
            'ModuleNameValidation',
            new (require('@fluidnext/library').validation.RegExValidation)(AbstractCommand.REGEX_NAME_MODULE, 'gm')
        );

        this._container.set(
            'WebComponentNameValidation',
            new (require('@fluidnext/library').validation.RegExValidation)(AbstractCommand.REGEX_NAME_WEB_COMPONENT, 'gm')
        );

        this._container.set(
            'DirectoryExist',
            new (require('@fluidnext/library').validation.DirectoryExistValidator)()
        );

        this._container.set(
            'DirectoryExistInPath',
            new (require('@fluidnext/library').validation.DirectoryExistInPathValidator)()
        );

        this._container.set(
            'ClassNameValidation',
            new (require('@fluidnext/library').validation.RegExValidation)(AbstractCommand.REGEX_NAME_CLASS, 'gm')
        );
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
