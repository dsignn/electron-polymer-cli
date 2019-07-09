import {CommandInterface} from "./CommandInterface";
import {Command} from "commander";
import {ProcessAware} from "../process";

/**
 *
 */
export class DeleteModuleCommand extends ProcessAware implements CommandInterface {

    static REGEX_NAME = /^[a-z0-9-]*$/gm;

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
        if (!this._validateName(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid name accept "${DeleteModuleCommand.REGEX_NAME}" given "${nameModule}"\n`)
            );
            this.getProcess().exit(1);
        }
        /**
         * Validate current working directory
         */
        if (!this._validateCurrentDirectory(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`)
            );
            this.getProcess().exit(1);
        }

        if (!this._notExistModule(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Module already exist "${nameModule}"\n`)
            );
            this.getProcess().exit(1);
        }

        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${nameModule}`;


       // this._updateConfigFiles(nameModule);
        //this._updateImportDev(nameModule);

        const chalk = require('chalk');
        console.log(
            chalk.green.underline.bold(`Module "${nameModule}" deleted\n`)
        );
    }

    /**
     * @param {string} name
     * @return {boolean}
     * @private
     */
    _validateName(name) {
        let isValid = false;
        if ((DeleteModuleCommand.REGEX_NAME.exec(name)) !== null) {
            isValid = true;
        }
        return isValid
    }

    /**
     * @param name
     * @return {boolean}
     * @private
     */
    _validateCurrentDirectory(name) {
        const fs = require('fs');
        let isValid = false;

        if (fs.existsSync(this.getApplicationPath()) && fs.existsSync(this.getModulesPath())) {
            isValid = true;
        }

        return isValid;
    }

    /**
     * @param name
     * @private
     */
    _notExistModule(name) {
        const fs = require('fs');
        let isValid = true;
        let content = fs.readdirSync(this.getModulesPath());
        for (let cont = 0; content.length > cont; cont++) {
            if (name === content[cont]) {
                isValid = false;
                break;
            }
        }

        return isValid;
    }


    /**
     *
     * @param {string} name
     * @private
     */
    _updateConfigFiles(name: string) {
        const fs = require('fs');
        const path = require('path');

    }

    _updateImportDev(nameModule) {
        const fs = require('fs');
        const path = require('path');

    }
}
