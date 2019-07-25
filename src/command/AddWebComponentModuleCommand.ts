import { CommandInterface } from "./CommandInterface";
// import { Command } from "commander";
// import { ProcessAware } from "../process";
import { AbstractModuleCommand } from "./AbstractModuleCommand";

export class AddWebComponentModuleCommand extends AbstractModuleCommand implements CommandInterface {

    public description: string = 'Add Webcomponent';

    public name: string = 'create-webcomponent --moduleName <moduleName> --webcomponentName <webcomponentName>';

    public alias: string = 'crw';

    public option: string = '';

    /**
     * 
     * @param {String} moduleName Name of the module
     * @param {String} webComponentName Name for the New class
     */
    public action(moduleName: string, webComponentName: string) {

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
        // if (!this._validateName(webComponentName)) {
        //     const chalk = require('chalk');
        //     console.log(
        //         chalk.red.underline.bold(`Invalid name accept "${AbstractModuleCommand.REGEX_NAME}" given "${webComponentName}"\n`)
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
        console.warn(webComponentName);
    }
}

