"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const AbstractModuleCommand_1 = require("./AbstractModuleCommand");
/**
 *
 */
class DeleteModuleCommand extends AbstractModuleCommand_1.AbstractModuleCommand {
    constructor() {
        super(...arguments);
        this.description = 'Create module';
        this.name = 'delete-module --name <name>';
        this.alias = 'dem';
        this.option = '';
    }
    /**
     * @param {string} nameModule
     */
    action(nameModule) {
        /**
         * Validate name module
         */
        if (!this._validateName(nameModule)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Invalid name accept "${AbstractModuleCommand_1.AbstractModuleCommand.REGEX_NAME}" given "${nameModule}"\n`));
            this.getProcess().exit(1);
        }
        /**
         * Validate current working directory
         */
        if (!this._validateCurrentDirectory(nameModule)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`));
            this.getProcess().exit(1);
        }
        if (this._notExistModule(nameModule)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Module not exist "${nameModule}"\n`));
            this.getProcess().exit(1);
        }
        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${nameModule}`;
        util_1.FsUtils.rmDirRecursive(modulePath);
        this._updateConfigFiles(nameModule);
        this._updateImportDev(nameModule);
        const chalk = require('chalk');
        console.log(chalk.green.underline.bold(`Module "${nameModule}" deleted\n`));
    }
    /**
     *
     * @param {string} name
     * @private
     */
    _updateConfigFiles(name) {
        const fs = require('fs');
        const path = require('path');
        let content = fs.readdirSync(this.getConfigPath());
        let body;
        let pathFile;
        for (let cont = 0; content.length > cont; cont++) {
            if (content[cont].startsWith('module')) {
                pathFile = `${this.getConfigPath()}${path.sep}${content[cont]}`;
                body = JSON.parse(fs.readFileSync(pathFile).toString());
                let index = body.findIndex((element) => {
                    return element.name === name;
                });
                body.splice(index, 1);
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    '));
            }
        }
    }
    /**
     * @param {string} nameModule
     * @private
     */
    _updateImportDev(nameModule) {
        const fs = require('fs');
        const path = require('path');
        const regexp = RegExp(DeleteModuleCommand.REGEX_COMMENT, 'g');
        let importPathDev = `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
        let body = fs.readFileSync(importPathDev).toString();
        let matches;
        let startIndex;
        let endIndex;
        while ((matches = regexp.exec(body)) !== null) {
            if (matches[0].includes(`start ${nameModule}`)) {
                startIndex = body.indexOf(matches[0]);
            }
            if (matches[0].includes(`end ${nameModule}`)) {
                endIndex = body.indexOf(matches[0]) + matches[0].length;
            }
        }
        if (startIndex > 0 && endIndex > 0) {
            fs.writeFileSync(importPathDev, [body.slice(0, startIndex - 1), body.slice(endIndex + 1)].join(''));
        }
    }
}
exports.DeleteModuleCommand = DeleteModuleCommand;
