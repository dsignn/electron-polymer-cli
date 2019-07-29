"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
class AddClassModuleCommand extends AbstractCommand_1.AbstractCommand {
    constructor() {
        super(...arguments);
        this.description = 'Add Class Module';
        this.name = 'create-class --moduleName <moduleName> --className <className>';
        this.alias = 'crc';
        this.option = '';
    }
    /**
     *
     * @param {String} moduleName Name of the module
     * @param {String} className Name for the New class
     */
    action(moduleName, className) {
        /**
         * Validate current working directory
         */
        if (!this.validatorContainer.get('DirectoryExist').isValid([this.getApplicationPath(), this.getModulesPath()])) {
            this.errorMessage(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`);
        }
        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${moduleName}`;
        console.warn(modulePath);
        console.warn(moduleName);
        console.warn(className);
    }
}
exports.AddClassModuleCommand = AddClassModuleCommand;
