import { CommandInterface } from "./CommandInterface";
// import { Command } from "commander";
// import { ProcessAware } from "../process";
import { AbstractModuleCommand } from "./AbstractModuleCommand";

export class AddClassModuleCommand extends AbstractModuleCommand implements CommandInterface{

    public description: string = 'Add Class Module';

    public name: string = 'create-class --moduleName <moduleName> --className <className>';

    public alias: string = 'crc';

    public option: string = '';

    /**
     * 
     * @param {String} moduleName Name of the module
     * @param {String} className Name for the New class
     */
    public action(moduleName: string, className: string){

        /**
         * Check If the module Exist
         */
        if (this._notExistModule(moduleName)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid name for the module. "${moduleName}" Not exist`)
            );
            this.getProcess().exit(1);
        }

        /**
         * Validate Class Name TODO
         */
        // if (!this._validateName(className)) {
        //     const chalk = require('chalk');
        //     console.log(
        //         chalk.red.underline.bold(`Invalid name accept "${AbstractModuleCommand.REGEX_NAME}" given "${className}"\n`)
        //     );
        //     this.getProcess().exit(1);
        // }

        /**
         * Validate current working directory
         */
        if (!this._validateCurrentDirectory(moduleName)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`)
            );
            this.getProcess().exit(1);
        }

        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${moduleName}`;

        console.warn(modulePath);
        console.warn(moduleName);
        console.warn(className);
    }
}

