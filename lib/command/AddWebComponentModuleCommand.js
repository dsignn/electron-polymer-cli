"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Command } from "commander";
// import { ProcessAware } from "../process";
const AbstractModuleCommand_1 = require("./AbstractModuleCommand");
class AddWebComponentModuleCommand extends AbstractModuleCommand_1.AbstractModuleCommand {
    constructor() {
        super(...arguments);
        this.description = 'Add Webcomponent';
        this.name = 'create-webcomponent --moduleName <moduleName> --webcomponentName <webcomponentName>';
        this.alias = 'crw';
        this.option = '';
    }
    /**
     *
     * @param {String} moduleName Name of the module
     * @param {String} webComponentName Name for the New class
     */
    action(moduleName, webComponentName) {
        /**
         * Check If the module Exist
         */
        if (this._notExistModule(moduleName)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Invalid name for the module. "${moduleName}" Not exist`));
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
            console.log(chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`));
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
exports.AddWebComponentModuleCommand = AddWebComponentModuleCommand;
