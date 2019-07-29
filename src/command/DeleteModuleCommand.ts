import {CommandInterface} from "./CommandInterface";
import {FsUtils} from "../util";
import {AbstractCommand} from "./AbstractCommand";

/**
 *
 */
export class DeleteModuleCommand extends AbstractCommand implements CommandInterface {

    description: string = 'Create module';

    name: string = 'delete-module --name <name>';

    alias: string = 'dem';

    option: string = '';

    /**
     * @param {string} nameModule
     */
    action(nameModule : string) {

        /**
         * Validate name module
         */
        if (this.validatorContainer.get('ModuleNameValidation').isValid(nameModule)) {
            this.errorMessage(`Invalid name accept fdfds "${AbstractCommand.REGEX_NAME_MODULE}" given "${nameModule}"\n`);
        }

        /**
         * Validate current working directory
         */
        if (!this.validatorContainer.get('DirectoryExist').isValid([this.getApplicationPath(), this.getModulesPath()])) {
            this.errorMessage(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`);
        }

        /**
         * Check if the module exist
         */
        this.validatorContainer.get('DirectoryExistInPath').setDefaultPath(
            '/home/visa/Project/3.0fluild/electron-polymer/app/module'
        );
        if (!this.validatorContainer.get('DirectoryExistInPath').isValid(nameModule)) {
            this.errorMessage(`Module already exist "${nameModule}"\n`);
        }

        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${nameModule}`;

        FsUtils.rmDirRecursive(modulePath);
        this._updateConfigFiles(nameModule);
        this._updateImportDev(nameModule);

        const chalk = require('chalk');
        console.log(
            chalk.green.underline.bold(`Module "${nameModule}" deleted\n`)
        );
    }

    /**
     *
     * @param {string} name
     * @private
     */
    _updateConfigFiles(name: string) {
        const fs = require('fs');
        const path = require('path');

        let content = fs.readdirSync(this.getConfigPath());
        let body;
        let pathFile;
        for (let cont = 0; content.length > cont; cont++) {
            if (content[cont].startsWith('module')) {
                pathFile = `${this.getConfigPath()}${path.sep}${content[cont]}`;
                body = JSON.parse(fs.readFileSync(pathFile).toString());

                let index =body.findIndex((element) => {
                    return element.name === name;
                });

                body.splice(index, 1);
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    ') );
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
        const regexp = RegExp(DeleteModuleCommand.REGEX_COMMENT,'g');

        let importPathDev = `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
        let body = fs.readFileSync(importPathDev).toString();

        let matches;
        let startIndex;
        let endIndex;

        while ((matches = regexp.exec(body)) !== null) {

            if (matches[0].includes( `start ${nameModule}`)) {
                startIndex = body.indexOf(matches[0]);
            }

            if (matches[0].includes( `end ${nameModule}`)) {
                endIndex = body.indexOf(matches[0]) + matches[0].length;
            }
        }

        if (startIndex > 0 && endIndex > 0) {
            fs.writeFileSync(importPathDev, [body.slice(0, startIndex - 1), body.slice(endIndex + 1)].join(''));
        }
    }
}
