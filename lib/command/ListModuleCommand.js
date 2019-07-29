"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
/**
 *
 */
class ListModuleCommand extends AbstractCommand_1.AbstractCommand {
    constructor() {
        super(...arguments);
        this.description = 'List command';
        this.name = 'list-module';
        this.alias = 'lim';
        this.option = '';
    }
    action(nameModule) {
        /**
         * Validate current working directory
         */
        if (!this.validatorContainer.get('DirectoryExist').isValid([this.getApplicationPath(), this.getModulesPath()])) {
            this.errorMessage(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`);
        }
        const fs = require('fs');
        const path = require('path');
        let body = JSON.parse(fs.readFileSync(`${this.getConfigPath()}${path.sep}module.json`).toString());
        const chalk = require('chalk');
        console.log(chalk.green.underline.bold(`List modules\n`));
        for (let cont = 0; body.length > cont; cont++) {
            console.log(`    ${body[cont].name}`);
        }
    }
}
exports.ListModuleCommand = ListModuleCommand;
